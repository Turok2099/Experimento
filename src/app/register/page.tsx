import RegisterView from "@/views/user/registerView/RegisterView";
import React, { Suspense } from "react";

const Register: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterView />
    </Suspense>
  );
};

export default Register;
