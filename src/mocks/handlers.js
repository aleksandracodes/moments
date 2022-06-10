const baseURl = 'https://moments-drf-api-ah.herokuapp.com/'
export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            ctx.json({
                pk: 6,
                username: "testuser",
                email: "",
                first_name: "",
                last_name: "",
                profile_id: 6,
                profile_image: "https://res.cloudinary.com/dpqhunepe/image/upload/v1/media/../default_profile_dgox3a"
            })
        );
    }),
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
