import useFadeNavigate from '../hooks/useFadeNavigate.ts';
import Logo from '../assets/images/pinkLogo.svg?react';
import KakaoIcon from '../assets/images/kakao.svg?react';

const MainPage = () => {
    const navigate = useFadeNavigate();

    const handleKakaoLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/kakao`;
    };

    return (
        <div className="bg-black h-full flex flex-col justify-center items-center">
            <div className="flex-[3] flex flex-col justify-center items-center gap-4">
                <Logo width={105} height={105} />
                <p className="font-point text-white text-3xl tracking-tighter">
                    핸들이 고장난 <span className="text-primary font-point">푸드트럭</span>
                </p>
            </div>
            <div className="flex-[2] flex flex-col justify-center gap-4 text-center max-w-screen-sm w-full px-12 sm:px-24">
                <button
                    className="bg-kakao text-kakao-black tracking-tighter text-base lg:text-lg mx-auto px-10 sm:px-24 py-5 rounded-lg font-bold relative w-full"
                    onClick={handleKakaoLogin}
                >
                    <KakaoIcon className="absolute left-4 top-1/2 -translate-y-1/2" width={24} height={24} />
                    카카오로 3초만에 시작하기
                </button>
                <div
                    className="bg-primary text-base lg:text-lg tracking-tighter mx-auto px-10 py-5 text-white rounded-lg font-bold sm:px-24 cursor-pointer w-full"
                    onClick={() => navigate('/login')}
                >
                    다른 방법으로 시작하기
                </div>
            </div>
        </div>
    );
};

export default MainPage;
