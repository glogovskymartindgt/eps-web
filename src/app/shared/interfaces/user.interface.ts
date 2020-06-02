export interface User {
    id: number;
    login?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phoneNumber?: string;
    email?: string;
    mobile?: string;
    organization?: string;
    function?: string;
    nickName?: string;
    profilePicture?: string;
    state?: string;
    created?: string;
    isVisible?: boolean;
    type?: string;
    avatar?: string;
    projectIdList?: number[];
    groupIdList?: number[];
}
