import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Role } from '../../enums/role.enum';
import { Regex } from '../../hazelnut/hazelnut-common/regex/regex';
import { CommentResponse } from '../../interfaces/task-comment.interface';
import { CommentService } from '../../services/comment.service';
import { ImagesService } from '../../services/data/images.service';
import { NotificationService } from '../../services/notification.service';

export abstract class CommentTabComponent implements OnInit {

    public addCommentForm: FormGroup;
    public comments: CommentResponse[] = [];
    public loading = false;

    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly role: typeof Role = Role;
    public attachmentFormat = '';
    public attachmentFileName = '';
    public attachmentPathName = '';

    protected constructor(
        protected readonly commentService: CommentService,
        protected readonly formBuilder: FormBuilder,
        protected readonly imagesService: ImagesService,
        protected readonly notificationService: NotificationService,
    ) {
    }

    public ngOnInit(): void {
        this.addCommentForm = this.formBuilder.group({
            newComment: [
                '',
                Validators.required
            ],
            attachment: ['']
        });
    }

    public onCommentAdded(): void {
        if (this.addCommentForm.invalid) {
            return;
        }
        const comment = this.addCommentForm.value.newComment.toString();
        if (RegExp(Regex.httpsStringPattern)
            .test(comment)) {
            this.sendUrlMessage(comment);
        } else {
            this.sendTextMessage(comment);
        }
    }

    public abstract onAttachmentAdded(): void;

    public onSendCommentService(actionPointComment): void {
        this.loading = true;
        this.commentService.addComment(actionPointComment)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((): void => {
                this.getAllComments();
                this.addCommentForm.controls.newComment.reset();
            }, (): void => {
                this.notificationService.openErrorNotification('error.addComment');
            });
    }

    public abstract getAllComments(): void;

    public deleteComment(comment: CommentResponse): void {
        this.loading = true;
        this.commentService.deleteById(comment.id)
            .subscribe((): void => {
                this.getAllComments();
            }, (): any => this.loading = false);
    }

    public onFileChange(event): void {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (): void => {
            this.imagesService.uploadImages([file])
                .subscribe((data: any): void => {
                    this.attachmentFormat = file.name.split('.')
                        .pop()
                        .toUpperCase();
                    this.attachmentFileName = file.name;
                    this.attachmentPathName = data.fileNames[file.name].replace(/^.*[\\\/]/, '');
                    this.onAttachmentAdded();
                }, (): void => {
                    this.attachmentFormat = '';
                    this.attachmentFileName = '';
                    this.attachmentPathName = '';
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    public trackCommentById(index: number, item: CommentResponse): any {
        return item.id;
    }

    protected abstract sendTextMessage(comment: string): void;

    protected abstract sendUrlMessage(comment: string): void;
}
