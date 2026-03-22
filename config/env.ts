import { useTenant } from "@/context/TenantContext";

const loadTenant = () =>{
  const {tenant} = useTenant();
  return tenant;
};

export const ENV = {
  LARAVEL_API: "https://laravel.ngrok.io/api",
  NEST_API: loadTenant()?.baseURL //"http://192.168.192.8:9000/api/v1" //'https://quiz-api.edukasof.com/api/v1' //'http://10.204.175.24:3250/api/v1' //
};
