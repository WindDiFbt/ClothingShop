import axios from '../../utils/APIUtil';

const InviteService = {
    inviteUser: (data) => {
        // data: { email, role }
        return axios.post('/invite', data);
    }
};

export default InviteService; 