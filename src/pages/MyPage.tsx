import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { editNickname, logout, withdraw } from '../apis/auth.ts';
import useTitleStore from '../store/titleStore';
import useUserStore from '../store/userStore.ts';
import useNotificationStore from '../store/notificationStore.ts';
import useStoresStore from '../store/storesStore.ts';
import useFadeNavigate from '../hooks/useFadeNavigate';
import useComment from '../hooks/useComment.ts';
import Loading from '../components/Loading.tsx';
import Comment from '../components/Comment.tsx';
import NoReview from '../components/NoReview.tsx';
import LogoIcon from '../assets/images/pinkLogo.svg?react';
import MessageSquareIcon from '../assets/images/messageSquare.svg?react';
import EditIcon from '../assets/images/edit2.svg?react';
import CheckIcon from '../assets/images/check.svg?react';
import Truck from '../assets/images/truck.svg?react';
import type { IMyComment } from '../types/comment';

export default function MyPage() {
    const navigate = useFadeNavigate();
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    const setTitle = useTitleStore((state) => state.setTitle);
    const { user: userInfo, setUser, setNickname: setUserNickname } = useUserStore();
    const { setCategory } = useStoresStore();
    const { closeSocket } = useNotificationStore();
    const { data, isLoading, refetch } = useComment<IMyComment>('me');
    const [isEditMode, setIsEditMode] = useState(false);
    const [nickname, setNickname] = useState('');

    const handleLogoutClick = async () => {
        // 로그아웃 버튼 클릭
        const response = await logout();

        if (response.msg === 'ok') {
            closeSocket();
            setCategory('');
            toast.success('로그아웃이 완료되었습니다.');
            setUser(null);
        }
    };

    const handleAccountDeletion = async () => {
        // 회원 탈퇴 버튼 클릭
        const response = await withdraw();

        if (response.msg === 'ok') {
            setUser(null);
            closeSocket();
            setCategory('');
            toast.success('회원탈퇴가 완료되었습니다.');
        }
    };
    const handleEditNickname = () => {
        // 닉네임 수정 버튼 클릭
        if (isEditMode) {
            // 저장 후 EditMode 종료
            if (nickname.trim() === '') {
                toast.error('닉네임을 입력해주세요.');
                return;
            }
            editNickname({ nickname }).then(() => {
                setUserNickname(nickname);
                toast.success('변경이 완료되었습니다.');
                setIsEditMode(false);
            });
        } else {
            // EditMode가 변경된 이후 focus (disabled 상태에서 focus 작동 안함)
            new Promise((resolve) => {
                setIsEditMode(true);
                resolve(true);
            }).then(() => {
                if (nicknameRef.current) {
                    nicknameRef.current.focus();
                }
            });
        }
    };

    useEffect(() => {
        setTitle('마이페이지');
        setNickname(userInfo?.nickname || '');
    }, [userInfo]);

    return (
        <>
            {!userInfo ? null : (
                <div className="px-8 sm:px-0 max-w-lg mx-auto h-full flex flex-col gap-8 sm:gap-12 pt-[50px] sm:pt-[60px]">
                    <div className="flex justify-between items-center gap-4">
                        <div className="flex justify-center">
                            <div className="rounded-full w-24 h-24 bg-review">
                                {!userInfo?.thumnail ? (
                                    <LogoIcon
                                        width={96}
                                        height={96}
                                        className="border-1 rounded-full border-category p-2 fill-logo-violet bg-white"
                                    />
                                ) : (
                                    <img
                                        src={userInfo?.thumnail}
                                        className="rounded-full w-24 h-24 border-1 border-category"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-1 relative">
                            <div className="flex flex-col gap-y-1">
                                <div className="">
                                    <span className="tracking-tighter text-lg pl-1">{nickname}</span>
                                    <input
                                        ref={nicknameRef}
                                        className="outline-none absolute left-0 bg-transparent w-full tracking-tighter text-lg pl-1"
                                        type="text"
                                        value={nickname}
                                        onChange={({ target }) => setNickname(target.value)}
                                        disabled={!isEditMode}
                                    />
                                    <button className="relative" onClick={handleEditNickname}>
                                        {isEditMode ? (
                                            <CheckIcon width={16} height={16} />
                                        ) : (
                                            <EditIcon
                                                className="duration-300 stroke-gray hover:stroke-primary"
                                                width={16}
                                                height={16}
                                            />
                                        )}
                                    </button>
                                </div>
                                <div className="text-base text-category tracking-tighter pl-1">
                                    {userInfo?.role === 'owner' ? '푸드트럭 사장님' : '푸드트럭 발견가'}
                                </div>
                            </div>
                        </div>
                        <button
                            className="border-1 text-sm border-category text-category px-4 py-1.5 rounded-lg duration-300 hover:border-primary hover:text-primary"
                            onClick={handleLogoutClick}
                        >
                            로그아웃
                        </button>
                    </div>
                    <button
                        className="text-xl text-primary border-1 border-primary font-bold tracking-tight w-full py-6 rounded-lg drop-shadow-lg bg-white"
                        onClick={() => navigate(`/my-truck`)}
                    >
                        <div className="flex gap-x-2 justify-center items-center">
                            내 가게 관리하기
                            <Truck width={23} height={23} className="pt-1" />
                        </div>
                    </button>
                    <div className="flex-1">
                        <div className="flex justify-start items-center gap-x-1 text-base mb-3 pt-2">
                            <MessageSquareIcon width={16} height={16} />
                            <span className="tracking-tight">
                                내가 남긴 리뷰 (<strong className="text-primary">{data?.comments.length}</strong>)
                            </span>
                        </div>
                        {(isLoading || !data?.comments) && <Loading />}
                        {data?.comments &&
                            (data.comments.length === 0 ? (
                                <div className="h-full">
                                    <NoReview />
                                </div>
                            ) : (
                                <div>
                                    {data.comments.map((comment) => (
                                        <Comment
                                            key={`my_comment_${comment._id}`}
                                            id={comment._id}
                                            content={comment.content}
                                            name={comment.storeId.name}
                                            authorId={comment.authorId}
                                            createdAt={comment.createdAt}
                                            refetch={refetch}
                                        />
                                    ))}
                                </div>
                            ))}
                    </div>
                    <button
                        className="self-center text-category underline text-sm pt-6 pb-4"
                        onClick={handleAccountDeletion}
                    >
                        탈퇴하기
                    </button>
                </div>
            )}
        </>
    );
}
