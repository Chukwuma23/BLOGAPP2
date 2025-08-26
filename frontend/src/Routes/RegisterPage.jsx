import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
    return(
        <div className="flex items-center justify-center h-[calc(100vh-80px)]  mb-20 relative top-40">
            <SignUp  signUpUrl="/register" />
        </div>
    )
}

export default RegisterPage;





