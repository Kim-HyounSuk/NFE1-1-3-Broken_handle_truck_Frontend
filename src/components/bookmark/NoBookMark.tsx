import Logo from '../../assets/images/pinkLogo.svg?react';

export default function NoBookMark() {
    return (
        <div className="flex flex-col gap-y-2 justify-center items-center">
            <Logo width={120} height={120} />
            <div className="text-center text-2xl sm:text-3xl font-point tracking-tighter">
                북마크가 없습니다.
                <br />
                <span className="font-point text-primary">나만의 푸드트럭</span>을 추가하세요!
            </div>
        </div>
    );
}
