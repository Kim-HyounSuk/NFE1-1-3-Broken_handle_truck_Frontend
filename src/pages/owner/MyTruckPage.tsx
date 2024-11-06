import { useCallback, useEffect, useRef } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import useTitleStore from '../../store/titleStore';
import useFadeNavigate from '../../hooks/useFadeNavigate';
import useMyStore from '../../hooks/useMyStore.ts';
import Button from '../../components/button';
import NoReview from '../../components/NoReview';
import EditStore from '../../components/EditStore';
import Comment from '../../components/Comment.tsx';
import MapMarker from '../../components/map/MapMarker.tsx';
import Logo from '../../assets/images/pinkLogo.svg?react';
import MessageSquare from '../../assets/images/messageSquare.svg?react';
import Toggle from '../../components/Toggle.tsx';

export default function MyTruckPage() {
	const mapRef = useRef<kakao.maps.Map | null>(null);
	const setTitle = useTitleStore((state) => state.setTitle);
	const navigate = useFadeNavigate();

	const { data, isLoading, refetch } = useMyStore();

	// resize될 때 marker를 가운데에 두기 위한 함수
	const handleUpdateMapCenter = useCallback(() => {
		if (mapRef.current && data?.store) {
			mapRef.current.setCenter(new window.kakao.maps.LatLng(data.store.coordinates[1], data.store.coordinates[0]));
		}
	}, [data?.store]);

	useEffect(() => {
		window.addEventListener('resize', handleUpdateMapCenter);
		return () => {
			window.removeEventListener('resize', handleUpdateMapCenter);
		};
	}, [handleUpdateMapCenter]);

	useEffect(() => {
		if (data && data.store) {
			setTitle(data.store.name);
		} else {
			setTitle('내 가게');
		}
	}, [data]);

	if (isLoading) {
		return <div></div>;
	}

	return (
		<>
			{data?.store ? (
				<div className='relative h-full flex flex-col'>
					<div className='bg-review h-64 rounded-b-3xl relative'>
						<Map
							className='w-full h-full rounded-b-3xl'
							center={{
								lat: data.store.coordinates[1],
								lng: data.store.coordinates[0],
							}}
							level={5}
						>
							<MapMarker
								title={data.store.name}
								category={data.store.category}
								coordinates={data.store.coordinates}
								onClick={() => {}}
							/>
						</Map>
						<div className='flex justify-end absolute bottom-3 z-10 w-[calc(100%-80px)] sm:w-[calc(100%-240px)] left-1/2 -translate-x-1/2'>
							<Toggle text={{ on: '영업중', off: '영업 종료' }} />
						</div>
					</div>
					<div className='w-[calc(100%-80px)] sm:w-[calc(100%-250px)] mx-auto mt-10 mb-5'>
						<label className='text-xs text-white/50 mix-blend-difference tracking-tight'>카테고리</label>
						<div className='mt-2 w-full outline-none border-none rounded-lg bg-form p-3'>{data.store.category}</div>
					</div>
					<Button defaultValue={data.store.paymentMethod} disabled />

					<div className='flex w-[calc(100%-80px)] sm:w-[calc(100%-250px)] mx-auto items-center gap-x-1 pt-11 mb-3'>
						<MessageSquare width={16} height={16} />
						<span className='tracking-tighter pb-1'>
							고객님이 남겨준 리뷰(
							<strong className='text-primary'>{data.comments.length}</strong>)
						</span>
					</div>
					<div className='w-[calc(100%-80px)] sm:w-[calc(100%-250px)] mx-auto pb-5 flex-1'>
						{data.comments.length !== 0 ? (
							<>
								{data.comments.map((comment) => (
									<Comment
										key={`my-truck-comment_${comment._id}`}
										id={comment._id}
										name={comment.authorId.nickname}
										authorId={comment.authorId._id}
										refetch={refetch}
										createdAt={comment.createdAt}
										content={comment.content}
									/>
								))}
							</>
						) : (
							<NoReview />
						)}
					</div>
					<div className='sticky bottom-0 w-full bg-white z-10'>
						{' '}
						{/* sticky로 변경 */}
						<EditStore />
					</div>
				</div>
			) : (
				<div className='h-full relative'>
					<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
						<div className='flex justify-center mb-2'>
							<Logo width={130} height={130} />
						</div>
						<div>
							<div className='font-point text-2xl sm:text-3xl tracking-tighter whitespace-nowrap text-center'>
								푸드트럭이 없습니다.
							</div>
							<div className='font-point text-2xl sm:text-3xl tracking-tighter whitespace-nowrap'>
								사장님, 가게를 <span className='text-primary font-point'>등록</span>해주세요!
							</div>
						</div>
						<div className='pt-5 w-full'>
							<button
								className='bg-primary text-xl text-white font-bold w-full py-5 rounded-lg'
								onClick={() => navigate(`/register`, { replace: true })}
							>
								내 가게 등록하기
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
