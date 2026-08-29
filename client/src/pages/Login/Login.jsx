import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { saveOrUpdateUser } from "../../utils";

const Login = () => {
  const { signIn, signInWithGoogle, loading, user, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state || "/";

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Form submit handler
  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const { user } = await signIn(email, password);
      await saveOrUpdateUser({
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      });
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  // Handle Google SignIn
  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGoogle();

      await saveOrUpdateUser({
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      });

      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace={true} />;

  // form submit handler

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--app-bg)" }}
    >
      <div
        className="surface flex w-full max-w-md flex-col rounded-2xl p-6 sm:p-10"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="mb-8 text-center">
          <h1
            className="my-3 text-4xl font-bold"
            style={{ color: "var(--ink)" }}
          >
            Log In
          </h1>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Sign in to access your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate=""
          action=""
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm"
                style={{ color: "var(--ink)" }}
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email Here"
                className="w-full rounded-lg border px-3 py-3 focus:outline-lime-500"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                data-temp-mail-org="0"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="text-sm mb-2"
                  style={{ color: "var(--ink)" }}
                >
                  Password
                </label>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                id="password"
                placeholder="*******"
                className="w-full rounded-lg border px-3 py-3 focus:outline-lime-500"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$&*]).{6,}$/,
                    message:
                      "Password must have 1 capital letter & 1 special char",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-lg py-3 font-semibold text-white transition"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
        <div className="space-y-1">
          <button className="text-xs hover:underline hover:text-lime-500 text-gray-400 cursor-pointer">
            Forgot password?
          </button>
        </div>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
          <p className="px-3 text-sm dark:text-gray-400">
            Login with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
        </div>
        <div
          onClick={handleGoogleSignIn}
          className="m-3 flex cursor-pointer items-center justify-center space-x-2 rounded-lg border border-gray-300 p-3 transition hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <FcGoogle size={32} />

          <p>Continue with Google</p>
        </div>
        <p className="px-6 text-sm text-center text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link
            state={from}
            to="/signup"
            className="hover:underline hover:text-lime-500 text-gray-600"
          >
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
