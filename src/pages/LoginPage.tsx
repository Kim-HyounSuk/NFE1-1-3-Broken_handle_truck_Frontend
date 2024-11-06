import Input from '../components/Input.tsx';
import { Controller, useForm } from 'react-hook-form';
import useFadeNavigate from '../hooks/useFadeNavigate.ts';
import KakaoIcon from '../assets/images/kakao.svg?react';
import { login } from '../apis/auth.ts';
import useUserStore from '../store/userStore.ts';
import { toast } from 'react-toastify';

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useFadeNavigate();
    const { setUser } = useUserStore();

    const { control, handleSubmit, reset } = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async ({ email, password }: LoginFormData) => {
        const response = await login({ email, password });

        if (response.msg === 'ok') {
            reset(); //form reset
            setUser(response.user);
        } else if (response.msg === '잘못된 이메일 또는 패스워드 입니다.') {
            reset();
            toast.error(`${response.msg}`);
        }
    };

    const handleKakaoLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/kakao`;
    };

    return (
        <div className="bg-black h-full flex flex-col justify-center items-center py-11">
            <div className="flex justify-center flex-col items-center mx-auto w-[calc(100%-100px)] sm:w-[calc(100%-320px)]">
                <p className="text-3xl font-point text-white py-11 tracking-tighter mt-4">로그인</p>
                {/* form 태그에 onSubmit 추가 */}
                <form
                    className="max-w-screen-sm w-full flex flex-col gap-16 sm:gap-24 pt-11"
                    onSubmit={handleSubmit(onSubmit)} // enter 키로 제출 가능
                >
                    <div className="flex flex-col gap-8">
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: '이메일은 필수 입력 항목입니다.',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: '잘못된 이메일 형식입니다.',
                                },
                            }}
                            render={({ field: { onChange, value, name }, fieldState: { invalid }, formState }) => (
                                <div className="relative">
                                    <Input
                                        name={name}
                                        value={value}
                                        onChange={onChange}
                                        id="email"
                                        label="이메일"
                                        type="text"
                                        placeholder="example@gmail.com"
                                    />
                                    {invalid && (
                                        <p className="absolute top-full left-0 text-primary text-xs py-1">
                                            {formState.errors.email?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: '비밀번호는 필수 입력 항목입니다.',
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                                    message: '영문, 숫자, 특수문자 포함 8 ~ 20자로 입력해주세요.',
                                },
                            }}
                            render={({ field: { onChange, value, name }, fieldState: { invalid }, formState }) => (
                                <div className="relative">
                                    <Input
                                        name={name}
                                        value={value}
                                        onChange={onChange}
                                        id="password"
                                        label="비밀번호"
                                        type="password"
                                        placeholder="**********"
                                    />
                                    {invalid && (
                                        <p className="absolute top-full left-0 text-primary text-xs py-1">
                                            {formState.errors.password?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* '로그인' 버튼의 타입을 'submit'로 설정 */}
                    <button
                        type="submit" // 이 부분을 submit 버튼으로 설정해야 Enter 키로 제출이 가능
                        className="bg-primary py-5 text-white rounded-lg font-bold w-full tracking-tighter"
                    >
                        로그인
                    </button>
                </form>
            </div>
            <div className="flex flex-col justify-center gap-2 pt-2 items-center mx-auto w-[calc(100%-100px)] sm:w-[calc(100%-320px)] pb-11">
                <p className="text-white text-xs py-2 line-text">또는</p>
                <button
                    type="button"
                    className="mb-4 bg-kakao tracking-tighter text-kakao-black py-5 rounded-lg font-bold relative w-full"
                    onClick={handleKakaoLogin}
                >
                    <KakaoIcon className="absolute left-4 top-1/2 -translate-y-1/2" width={24} height={24} />
                    카카오 로그인
                </button>
                <p className="text-white tracking-tighter">
                    계정이 없으신가요?{' '}
                    <strong
                        className="text-primary font-bold cursor-pointer tracking-tighter"
                        onClick={() => navigate('/signup')}
                    >
                        가입하기
                    </strong>
                </p>
            </div>
        </div>
    );
}
