import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import { withFormik, Form, Field } from "formik";
import axios from "axios";

function LoginForm({ errors, touched, values, status }) {

  const [user, setUser] = useState([])

  useEffect(() => {
    status && setUser(users => [...users, status])
  }, [status])

  return ( 
    <div>
      <Form>
        <Field type='text' name='username' placeholder='Username' />
        {touched.username && errors.username && <p>{errors.username}</p>}
        <Field type='text' name='email' placeholder='Email' />
        {touched.email && errors.email && <p>{errors.email}</p>}
        <Field type='password' name='password' placeholder='Password' />
        {touched.password && errors.password && <p>{errors.password}</p>}
        <Field component="select" name="role" value={values.role}>
          <option>Choose a role</option>
          <option>Educator</option>
          <option>Salesman</option>
          <option>Developer</option>
        </Field>
        {touched.role && errors.role && <p>{errors.role}</p>}
        <label>
          <Field type="checkbox" name="terms" 
            // value={values.terms} 
          />
          I accept the terms and conditions.
        </label>
        <button type="submit">Submit!</button>
      </Form>

      {user.map(user => (
        <ul key={user.username}>
          <li>Username: {user.username}</li>
          <li>Email: {user.email}</li>
          <li>Password: {user.password}</li>
          <li>Role: {user.role}</li>
          {user.terms !== false ? <li>Terms: true</li> : <li>Terms: false</li> }
        </ul>
      ))}
    </div>
  );
}

const FormikForm = withFormik({
  mapPropsToValues({ username, email, password, role, terms }) {
    return {
      username: username || "",
      email: email || "",
      password: password || "",
      role: "",
      terms: false
    }
  },

  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required("Username required"),
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6 characters or longer")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["Educator", "Salesman", "Developer"])
      .required("Choose a role"),
    terms: Yup.bool()
  }),

  handleSubmit(values, { resetForm, setErrors, setSubmitting, setStatus }) {
    console.log(values)
    if (values.email === "waffle@syrup.com") {
      setErrors({ email: "That email is already taken" })
    } else {
      axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
          console.log("Success: ", res)
          setStatus(res.data)
          resetForm()
          setSubmitting(false)
        })
        .catch(err => {
          console.log(err)
          setSubmitting(false)
        })
    }
  }
})(LoginForm)

export default FormikForm;