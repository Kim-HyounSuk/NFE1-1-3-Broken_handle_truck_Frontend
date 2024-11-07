import CheckIcon from '../assets/images/check.svg?react';
import Input from '../components/Input.tsx';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { checkEmail, signup } from '../apis/auth.ts';
import useFadeNavigate from '../hooks/useFadeNavigate.ts';
import { toast } from 'react-toastify';

interface SignUpFormData {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
}

export default function SignUpPage() {
    const navigate = useFadeNavigate();
    const {
        control,
        handleSubmit,
        getValues,
        setError,
        reset,
        formState: { errors, isValid },
    } = useForm<SignUpFormData>({
        defaultValues: {
            email: '',
            nickname: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const handleCheckEmail = async (email: string) => {
        if (errors.email) {
            setIsEmailChecked(false);
            return;
        }

        const result = await checkEmail(email);

        if (result.isAble) {
            setIsEmailChecked(true);
        } else {
            if (result.msg === '이메일 필드는 필수 요소 입니다.') {
                setError(
                    'email',
                    {
                        type: 'requiredEmail',
                        message: '이메일은 필수 입력 항목입니다.',
                    },
                    { shouldFocus: true }
                );
                setIsEmailChecked(false);
            } else {
                setError(
                    'email',
                    {
                        type: 'registeredEmail',
                        message: '이미 등록된 이메일입니다.',
                    },
                    { shouldFocus: true }
                );
                setIsEmailChecked(false);
            }
        }
    };

    const onSubmit = async ({ email, nickname, password }: SignUpFormData) => {
        const response = await signup({ email, nickname, password });

        if (response.msg === 'ok') {
            reset(); //form reset
            setIsEmailChecked(false);

            //다시 login으로 이동
            toast.success('회원가입이 완료되었습니다.');
            setTimeout(() => {
                navigate('/login');
            }, 0);
        }
    };

    return (
        <div className="bg-black h-full flex flex-col justify-center items-center gap-10 relative py-16">
            <p className="text-3xl font-point text-white pt-12 sm:py-8 tracking-tight">회원가입</p>
            <form
                className="mx-auto w-[calc(100%-55px)] sm:w-[calc(100%-350px)] flex flex-col items-center mb-24"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="max-w-screen-sm w-full flex flex-col gap-8 pt-4 sm:py-8">
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
                                    onChange={(e) => {
                                        onChange(e);
                                        setIsEmailChecked(false);
                                    }}
                                    id="email"
                                    label="이메일"
                                    placeholder="example@gmail.com"
                                >
                                    <button
                                        className="bg-primary tracking-tighter text-xs text-white px-3 sm:px-4 py-2 rounded-lg"
                                        type="button"
                                        onClick={() => handleCheckEmail(value)}
                                    >
                                        중복확인
                                    </button>
                                </Input>
                                {invalid && (
                                    <p className="absolute top-full left-0 text-primary text-xs py-1 tracking-tighter">
                                        {formState.errors.email?.message}
                                    </p>
                                )}
                                {isEmailChecked && (
                                    <p className="absolute top-full left-0 text-success text-xs py-1 tracking-tighter">
                                        사용할 수 있는 이메일입니다.
                                    </p>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="nickname"
                        control={control}
                        rules={{
                            required: '닉네임은 필수 입력 항목입니다.',
                        }}
                        render={({ field: { onChange, value, name }, fieldState: { invalid }, formState }) => (
                            <div className="relative">
                                <Input
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    id="nickname"
                                    label="닉네임"
                                    placeholder="example"
                                />
                                {invalid && (
                                    <p className="absolute top-full left-0 text-primary text-xs py-1">
                                        {formState.errors.nickname?.message}
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
                        render={({ field: { onChange, value, name }, fieldState: { invalid, isDirty }, formState }) => (
                            <div className="relative">
                                <Input
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    id="password"
                                    label="비밀번호"
                                    type="password"
                                    placeholder="**********"
                                >
                                    {isDirty && !invalid && (
                                        <CheckIcon width={18} height={18} className="stroke-primary" />
                                    )}
                                </Input>
                                {invalid && (
                                    <p className="absolute top-full left-0 text-primary text-xs py-1 tracking-tighter">
                                        {formState.errors.password?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                            required: '비밀번호 확인은 필수 입력 항목입니다.',
                            validate: {
                                matchPassword: (value) =>
                                    getValues().password === value || '비밀번호가 일치하지 않습니다.',
                            },
                        }}
                        render={({ field: { onChange, value, name }, fieldState: { invalid, isDirty }, formState }) => (
                            <div className="relative">
                                <Input
                                    name={name}
                                    value={value}
                                    onChange={onChange}
                                    id="confirm-password"
                                    label="비밀번호 확인"
                                    type="password"
                                    placeholder="**********"
                                >
                                    {isDirty && !invalid && (
                                        <CheckIcon width={18} height={18} className="stroke-primary" />
                                    )}
                                </Input>
                                {invalid && (
                                    <p className="absolute top-full left-0 text-primary text-xs py-1 tracking-tighter">
                                        {formState.errors.confirmPassword?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>
                <button
                    className="bg-primary max-w-screen-md tracking-tight font-bold w-full pt-6 pb-8 sm:pb-12 text-white fixed bottom-0 disabled:bg-disabled disabled:text-white/60 disabled:cursor-default"
                    disabled={!isEmailChecked || !isValid}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
}
