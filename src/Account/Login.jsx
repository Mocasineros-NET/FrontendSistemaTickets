import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useUserActions } from "../_actions";
import { Logo } from '../_components/Logo';

export { Login };

function Login() {
  const userActions = useUserActions();

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit(userActions.login)} className="card w-[20%] h-[440px]">
        <div className="card-body">
          <Logo />
          <h1 className="card-title text-5xl mt-2 mb-2">Sign in</h1>
          <label className="label m-0 p-0">
            <span className="label-text text-slate-500 font-bold">Username</span>
          </label>
          <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.username?.message}</div>
          <label className="label m-0 p-0">
            <span className="label-text text-slate-500 font-bold">Password</span>
          </label>
          <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''} input input-bordered w-full max-w-xs bg-slate-200`} />
          <div className="invalid-feedback">{errors.password?.message}</div>
          <div className="card-actions justify-start mt-3">
            <button disabled={isSubmitting} className="btn text-white bg-slate-900 hover:bg-stone-900">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Login
            </button>
            <Link to="register" className="btn text-white bg-sky-700 hover:bg-stone-600 border-none">
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
