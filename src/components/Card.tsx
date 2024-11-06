import BookMarkButton from './BookMarkButton';
import useFadeNavigate from '../hooks/useFadeNavigate.ts';
import { categoryImages } from '../assets/images/category';
import { categories } from '../constants/categories.ts';

interface CardProps {
    info: {
        storeId: string;
        category: string;
        name: string;
        visited?: number;
        comments?: number;
        isOpen: boolean;
    };
    bg: string;
}

export default function Card({ info, bg = 'black' }: CardProps) {
    const visitOrComments = info.visited ?? info.comments ?? 0; // 방문자 수
    const navigate = useFadeNavigate();
    const ImgComponent =
        // 이후 categoryImages[info.category].component 로 수정 필요
        categoryImages[categories.includes(info.category) ? info.category : '기타'].component;

    return (
        <div
            className={`bg-${bg} w-full rounded-2xl px-4 pt-4 pb-5 flex flex-col gap-y-8 ${
                bg === 'white' ? 'drop-shadow-lg' : null
            }`}
        >
            <div className="tracking-tight flex gap-x-3">
                <div className="flex-none flex items-center justify-center">
                    {ImgComponent && <ImgComponent width={60} height={60} />}
                </div>
                <div className="flex flex-col justify-center">
                    <div className="text-xs text-category mb-1">{info.category}</div>
                    <div
                        className={`${
                            bg === 'white' ? 'text-black' : 'text-white'
                        } font-bold text-base whitespace-nowrap`}
                    >
                        {info.name}
                    </div>
                    <div className="gap-x-1 text-xs text-category bg-count px-2 py-1 rounded-2xl whitespace-nowrap inline-flex max-w-fit mt-2">
                        <span>최근 방문</span>
                        <span className="text-white">{visitOrComments}명</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-y-2 pt-2">
                    <div className="flex justify-end">
                        <BookMarkButton
                            storeId={info.storeId}
                            // onClick={() => handleBookmarkToggle(info.storeId)}
                            size={30}
                        />
                    </div>
                    <div className="flex justify-end text-xs gap-x-1 text-white items-center">
                        <div className={`w-1 h-1 rounded-full ${info.isOpen ? 'bg-success' : 'bg-category'}`}></div>
                        <div className={`whitespace-nowrap ${bg === 'white' ? 'text-black' : 'text-white'}`}>
                            {info.isOpen ? '운영중' : '운영종료'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <button
                    className="text-right bg-primary py-2 px-3 tracking-tight rounded-md text-white font-bold text-sm"
                    onClick={() => navigate(`/detail/${info.storeId}`)}
                >
                    자세히 보기
                </button>
            </div>
        </div>
    );
}
