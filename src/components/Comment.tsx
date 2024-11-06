import { toast } from 'react-toastify';
import { deleteComment } from '../apis/comment.ts';
import useUserStore from '../store/userStore.ts';
import Delete from '../assets/images/delete.svg?react';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import useFadeNavigate from '../hooks/useFadeNavigate.ts';

interface CommentProps {
	id: string;
	authorId: string;
	refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<{ comments: unknown[] }, unknown>>;
	name: string;
	content: string;
	createdAt: string;
	storeId: string;
}

export default function Comment({ id, authorId, refetch, name, createdAt, content, storeId }: CommentProps) {
	const { user } = useUserStore();
	const location = useLocation();
	const navigate = useFadeNavigate();

	const handleDeleteComment = () => {
		deleteComment({ commentId: id }).then((data) => {
			if (data.msg === 'ok') {
				refetch().then(() => {
					toast.success('삭제되었습니다.');
				});
			} else {
				toast.error(data.msg);
			}
		});
	};

	return (
		<div className='bg-white tracking-tighter border-b-1 border-comment'>
			<div className='flex justify-between py-3 text-xs items-center'>
				<div
					onClick={() => location.pathname === '/my-page' && navigate(`/detail/${storeId}`)}
					className={`font-bold text-black text-base ${
						location.pathname === '/my-page' && 'cursor-pointer hover:text-primary'
					}`}
				>
					{name}
				</div>
				<div className='flex gap-x-2 align-middle'>
					<div className='text-category'>{createdAt}</div>
					{user?._id === authorId && (
						<button onClick={handleDeleteComment}>
							<Delete width={15} height={15} />
						</button>
					)}
				</div>
			</div>
			<div className='py-5 text-sm text-black text-left break-words whitespace-normal'>{content}</div>
		</div>
	);
}
