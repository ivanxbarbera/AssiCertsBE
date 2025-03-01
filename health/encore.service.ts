import { Service } from "encore.dev/service";

// Encore will consider this directory and all its subdirectories as part of the "health" service.
// https://encore.dev/docs/ts/primitives/services

// health service responds to requests with a personalized greeting.
export default new Service("health");
