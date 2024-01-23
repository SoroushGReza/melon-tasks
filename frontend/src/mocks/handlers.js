import { rest } from "msw";

// Setting base URL for API requests
const baseURL = "/api";

// Array of mock API request handlers.
export const handlers = [
  // Handling a GET request to "/api/dj-rest-auth/user/"
  // used to get user details.
  rest.get(`${baseURL}/dj-rest-auth/user/`, (req, res, ctx) => {
    // Returning mock response with user details
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
  // Handling a POST request to '/api/dj-rest-auth/logout/'
  // Uused for user logout
  rest.post(`${baseURL}/dj-rest-auth/logout/`, (req, res, ctx) => {
    // Returning a response with status 200 (successfull logout)
    return res(ctx.status(200));
  }),
];
