import React from 'react';
import * as Yup from "yup";
import { withFormik, Form, Field } from "formik";
import axios from "axios";

function LoginForm({ values, errors, touched }) {
  return ( 
    <Form>
      {touched.name && errors.name && <p>{errors.name}</p>}
      <Field type='text' name='username' placeholder='Username' />
      {touched.email && errors.email && <p>{errors.email}</p>}
      <Field type='text' name='email' placeholder='Email' />
      {touched.password && errors.password && <p>{errors.password}</p>}
      <Field type='password' name='password' placeholder='Password' />
      <label>
        <Field type="checkbox" name="terms" />
        I accept the terms and conditions.
      </label>
      <button type="submit">Submit!</button>
    </Form>
  );
}

const FormikForm = withFormik({
  mapPropsToValues({ username, email, password, terms }) {
    return {
      username: username || "",
      email: email || "",
      password: password || "",
      terms:  terms || false
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
      .required("Password is required")
  }),

  handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
    console.log(values)
    if (values.email === "waffle@syrup.com") {
      setErrors({ email: "That email is already taken" })
    } else {
      axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
          console.log(res)
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