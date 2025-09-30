import { request } from "../../src/config/apiClient.js";
import { users } from "../../src/services/userService.js";
import { user } from "../testdata/createUser.js";

const token = "";
let userId = "";

describe('Test the Users API', async function () {
    it('Create a new user', async function () {
        const createUserResponse = await request().post(users.createUser)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(201);

        expect(createUserResponse.body).to.have.property('id').to.exist;

        userId = createUserResponse.body.id;
    })
    it('Retrieve user details', async function () {
        const getUserDetailsResponse = await request()
        .get(users.getUsers(userId))
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

        expect(getUserDetailsResponse.body.name).to.be.equal(user.name)
    })
})