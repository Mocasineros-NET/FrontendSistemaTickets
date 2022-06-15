import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRecoilValue } from 'recoil';

import { userAtom } from "../_state";
import { useAlertActions, useUserActions } from "../_actions";

export { AddEdit };

function AddEdit({ history, match }) {
  const { id } = match.params;
  const mode = { add: !id, edit: !!id };
  const userActions = useUserActions();
  const alertActions = useAlertActions();
  const user = useRecoilValue(userAtom);

  // form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    email: Yup.string()
      .required('Email is required'),
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .transform(x => x === '' ? undefined : x)
      .concat(mode.add ? Yup.string().required('Password is required') : null)
      .min(6, 'Password must be at least 6 characters')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    // fetch user details into recoil state in edit mode
    if (mode.edit) {
      userActions.getById(id);
    }

    return userActions.resetUser;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set default form values after user set in recoil state (in edit mode)
    if (mode.edit && user) {
      reset(user);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function onSubmit(data) {
    return mode.add
      ? createUser(data)
      : updateUser(user.id, data);
  }

  function createUser(data) {
    return userActions.register(data)
      .then(() => {
        history.push('/Users');
        alertActions.success('User added');
      });
  }

  function updateUser(id, data) {
    return userActions.update(id, data)
      .then(() => {
        history.push('/Users');
        alertActions.success('User updated');
      });
  }

  const loading = mode.edit && !user;
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="font-bold text-2xl m-auto">{mode.add ? 'Add User' : 'Edit User'}</h1>
          {!loading &&
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input name="firstName" type="text" {...register('firstName')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.firstName ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input name="lastName" type="text" {...register('lastName')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.lastName ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input name="email" type="text" {...register('email')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.email ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input name="username" type="text" {...register('username')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.username ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">{!mode.edit && "Password"}{mode.edit && "Password (Leave blank to keep the same password)"}</span>
              </label>
              <input name="password" type="password" {...register('password')} placeholder="Type here" className={`input bg-white input-bordered w-full max-w-xs ${errors.password ? 'is-invalid' : ''}`}/>
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="form-group mt-6">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"/>}
                Save
              </button>
              <Link to="/users" className="btn btn-link">Cancel</Link>
            </div>
          </form>
          }
        </div>
      </div>
      {loading &&
      <div className="text-center p-3">
        <span className="spinner-border spinner-border-lg align-center"/>
      </div>
      }
    </div>
  );
}
