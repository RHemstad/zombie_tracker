
import '../../css/forms.css'
import './register.css'
import { useRef, useState, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../button/Button';
import axios from '../../api/axios';
import { Link, useNavigate, useLocation } from "react-router-dom";
import BackAni from '../background_animation/BackAni';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = 'http://localhost:3500/register'; //endpoint for registration in backend


//Register - aka sign up, create account
const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || '/dashboard';

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    /* **************************** */
    /* **** USE EFFECT ************ */
    /* **************************** */

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(username));
        /* following is just for testing */
        //const result = USER_REGEX.test(username);
        //console.log(result);
        //console.log(username);
        //setValidName(result);

    }, [username])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
        /* following is just for testing */
        //const result = PWD_REGEX.test(password);
        //console.log(result);
        //console.log(password);
        const match = password === matchPwd;
        setValidMatch(match);
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPwd])

    /* **************************** */
    /* **** HANDLE SUBMIT ******* */
    /* **************************** */

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response.data);
            //console.log(response.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }

    }


  return (
    <>
     <BackAni />
    <section id="register" className="glass-effect">

    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <h2>Register</h2>

    {/* START FORM */}
    <form onSubmit={handleSubmit}>

        {/* ******************* */}
        {/* **** USER NAME **** */}
        {/* ******************* */}

        <label htmlFor="username">
            Username:
            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validName || !username ? "hide" : "invalid"} />
        </label>
        <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={username}
            required
            aria-invalid={validName ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
        />
        <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />4 to 24 characters.
            Must begin with a letter.
        </p>

        {/* ******************* */}
        {/* **** PASSWORD **** */}
        {/* ******************* */}

        <label htmlFor="password">
            Password:
            {/* I HAVE A BUG HERE so turning off icon for now */}
             {/* <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} /> */}
        </label>
        <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={password}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
        />
        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />8 to 24 characters.
            Must include uppercase and lowercase letters, a number and a special character.
            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
        </p>

        {/* ************************** */}
        {/* **** CONFIRM PASSWORD **** */}
        {/* ************************** */}

        <label htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
        </label>
        <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
        />
        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
        </p>

        <button className="primary-button">Sign Up</button>

            {/* 
            //this is how to do it disabled until correct but not sure I like it
            <button className="primary-button" disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button> */}



    </form>
    {/* END FORM */}

    <p className="note">Already registered?<br />
    <Link to="/login">Login</Link>
    </p>
    </section>
    </>
  )
}

export default Register