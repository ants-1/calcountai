import initialiseSignUp from "./strategies/initialiseSignUp";
import initialiseLogin from "./strategies/initialiseLogin";

const initialisePassport = (): void => {
    initialiseSignUp();
    initialiseLogin();
}

export default initialisePassport;