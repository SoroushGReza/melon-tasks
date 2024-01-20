import { rest } from "msw";

const baseURL = "/api";

export const handlers = [
  rest.get(`${baseURL}/dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 23,
        username: "admin",
        email: "",
        first_name: "",
        last_name: "",
        account_id: 23,
        account_image:
          "https://res.cloudinary.com/grezacloud/image/upload/v1/media/images/OIG_2_kdraya",
      })
    );
  }),
  rest.post(`${baseURL}/dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
