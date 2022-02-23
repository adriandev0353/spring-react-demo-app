

import React from 'react'
import Footer from '../../fragments/footer/FooterCover'
import Background from '../../fragments/background/Background'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticationService from '../../../../api/authentication/AuthenticationService'
import LoginService from '../../../../api/login/LoginService'
import styles from '../../../../css/Forms.module.css'
import { Link } from 'react-router-dom'
import AuthenticateUserDataService from '../../../../api/authentication/AuthenticateUserDataService'



const Login = () => {
    const navigate = useNavigate();


    const [errors, setErrors] = useState({});

    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [loginState, setLoginState] = useState({
        hasLoginFailed: false,
        showSuccessMessage: false
    })


    const validate = () => {
        const errors = {};

        if (!credentials.username) {
            errors.username = 'Username required'
        } else if (credentials.username.length < 4) {
            errors.username = 'Minimum 4 characters'
        }


        if (!credentials.password) {
            errors.password = "A password is required"
        }


        return errors;
    }

    const loginClicked = async event => {
        event.preventDefault();
        let errors = validate(credentials)
        setErrors(errors);
        console.log(errors);
        if (Object.keys(errors).length === 0) {
            const res = await AuthenticateUserDataService(credentials.username, credentials.password);
            console.log(res.data);

            if (res.status !== 200) {
                setLoginState(prevState => ({ ...prevState, hasLoginFailed: true }))
                setLoginState(prevState => ({ ...prevState, showSuccessMessage: false }))
            }

            else {
                let jwtToken = res.data.jwtToken;
                const token = `Bearer ${jwtToken}`;
                AuthenticationService.setUpToken(token);
                const response = await LoginService(credentials.username, jwtToken);
                console.log(response);
                if (response.status !== 200) {
                    setLoginState(prevState => ({ ...prevState, hasLoginFailed: true }))
                    setLoginState(prevState => ({ ...prevState, showSuccessMessage: false }))
                } else if (response.data === 'USER') {
                    AuthenticationService.registerSuccessfulLoginUser(credentials.username)
                    navigate("/user-home")

                    setLoginState(prevState => ({ ...prevState, hasLoginFailed: false }))
                    setLoginState(prevState => ({ ...prevState, showSuccessMessage: true }))
                    window.location.reload(false)
                }
                else if (response.data === 'BUSINESS_USER') {
                    AuthenticationService.registerSuccessfulLoginBusiness(credentials.username)
                    navigate("/business-owner")

                    setLoginState(prevState => ({ ...prevState, hasLoginFailed: false }))
                    setLoginState(prevState => ({ ...prevState, showSuccessMessage: true }))
                    window.location.reload(false)
                }
            }
        }
    }

    return (
        <main>
            <form className={styles.form_style}>
                <div className={styles.loginh1}><h1 >Login</h1></div>
                <div className={styles.login} >
                

                        {loginState.hasLoginFailed && <div className={styles.midErrors} > Invalid credentials</div>}
                        {loginState.showSuccessMessage && <div className={styles.midErrors}>Login successful</div>}


                        <div className={styles.form_field}>
                            <section className={styles.name_section}>
                                <input id="username" type="text" name="username" onChange={e => setCredentials({ ...credentials, username: e.target.value })} required />
                                <label htmlFor="username" className={styles.label_name}>
                                    {Object.keys(errors).length === 0 && <span className={styles.content_name}>Username</span>}
                                    {errors.username && <small className={styles.errors}>{errors.username}</small>}
                                </label>
                            </section>
                        </div>
           
                  
                        <div className={styles.form_field}>
                            <section className={styles.name_section}>
                                <input type="password" id="password" name="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} required />
                                <label htmlFor="password" className={styles.label_name}>
                                    {Object.keys(errors).length === 0 && <span className={styles.content_name}>Password</span>}
                                    {errors.password && <small className={styles.errors}>Password required</small>}
                                </label>
                            </section>
                        </div>
              

                    <p>
                        <Link to="/change-password" className={styles.button_password_forgot}>Forgot your password?</Link>
                    </p>


                    <button className={styles.button} onClick={loginClicked}>Login</button>

                </div>
            </form>
            <Footer/>
            <Background />
        </main>
    )
}


export default Login
