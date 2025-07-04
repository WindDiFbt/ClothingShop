import axios from '../../utils/APIUtil';

const InviteService = {
    inviteUser: (data) => {
        // data: { email, role }
        return axios.post('/invite', data);
    },
    createUserFromInvite: (data) => {
        // data: { userName, email, password, fullName, phoneNumber, gender, dateOfBirth, address, avatarUrl }
        return axios.post('/invite/create-user', data);
    }
};

export default InviteService; 