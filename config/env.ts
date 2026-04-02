
export const ENV = {
  LARAVEL_API: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1` || "https://staging.edukasof.com/api/v1",
  NEST_API: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1` || "https://staging.edukasof.com/api/v1"
};

// console.log(`expo variable for api url ==> process.env.EXPO_PUBLIC_API_BASE_URL: ${process.env.EXPO_PUBLIC_API_BASE_URL}`);
// console.log(`config variable for api url ==> ENV.LARAVEL_API: ${ENV.LARAVEL_API}`);
