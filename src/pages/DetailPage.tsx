import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Map } from 'react-kakao-maps-sdk';
import { getStore } from '../apis/store.ts';
import useTitleStore from '../store/titleStore.ts';
import useComment from '../hooks/useComment.ts';
import Button from '../components/button';
import Comment from '../components/Comment';
import NoReview from '../components/NoReview';
import WriteReview from '../components/WriteReview';
import MapMarker from '../components/map/MapMarker.tsx';
import MessageSquare from '../assets/images/messageSquare.svg?react';
import type { IStore } from '../types/store';
import type { IComment } from '../types/comment';

export default function DetailPage() {
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const { id: storeId } = useParams<{ id: string }>();
    const { setTitle } = useTitleStore();
    const { data, isLoading } = useComment<IComment>(storeId!);
    const [storeInfo, setStoreInfo] = useState<IStore | null>(null);

    // resize될 때 marker를 가운데에 두기 위한 함수
    const handleUpdateMapCenter = useCallback(() => {
        if (mapRef.current && storeInfo) {
            mapRef.current.setCenter(new window.kakao.maps.LatLng(storeInfo.coordinates[1], storeInfo.coordinates[0]));
        }
    }, [storeInfo]);

    useEffect(() => {
        if (storeId) {
            getStore(storeId).then((data) => {
                setStoreInfo(data.store);
                // setComments(data.comments);
                setTitle(data.store.name);
            });
        }
    }, [storeId]);

    useEffect(() => {
        window.addEventListener('resize', handleUpdateMapCenter);
        return () => {
            window.removeEventListener('resize', handleUpdateMapCenter);
        };
    }, [handleUpdateMapCenter]);

    if (!storeInfo || isLoading) {
        // 로딩
        return <div></div>;
    }

    if (!data?.comments) {
        // 404
        return <div></div>;
    }

    return (
        <div className="relative">
            <div className="pb-11 mb-5">
                <div className="bg-review h-64 rounded-b-3xl">
                    <Map
                        ref={mapRef}
                        className="w-full h-full rounded-b-3xl"
                        center={{
                            lat: storeInfo.coordinates[1],
                            lng: storeInfo.coordinates[0],
                        }}
                        level={3}
                        // 지도 조작 못하도록 설정
                        zoomable={false}
                        draggable={false}
                    >
                        <MapMarker
                            title={storeInfo.name}
                            category={storeInfo.category}
                            coordinates={storeInfo.coordinates}
                            onClick={() => {}}
                        />
                    </Map>
                    <div className="h-full py-8 flex justify-end items-end"></div>
                </div>
                <div className="flex flex-col gap-y-5 mx-auto mt-10">
                    <div className="w-[calc(100%-80px)] sm:w-[calc(100%-250px)] mx-auto">
                        <label className="text-xs text-white/50 mix-blend-difference tracking-tight">카테고리</label>
                        <div className="mt-2 w-full outline-none border-none rounded-lg bg-form p-3">
                            {storeInfo.category}
                        </div>
                    </div>
                    <Button defaultValue={storeInfo.paymentMethod} disabled />
                </div>
                <div className="flex justify-start items-center gap-x-1 text-base mx-auto mb-3 pt-11 w-[calc(100%-80px)] sm:w-[calc(100%-250px)]">
                    <MessageSquare width={16} height={16} />
                    <span className="tracking-tight">
                        리뷰
                        <strong className="text-primary"> {data.comments.length}</strong>개
                    </span>
                </div>
                {data.comments.length === 0 ? (
                    <div className="w-[calc(100%-80px)] sm:w-[calc(100%-250px)] mx-auto">
                        <NoReview />
                    </div>
                ) : (
                    <div className="w-[calc(100%-80px)] sm:w-[calc(100%-250px)] mx-auto ">
                        {data.comments.map((comment: IComment) => (
                            <Comment
                                key={`comment_${comment._id}`}
                                id={comment._id}
                                name={comment.authorId.nickname}
                                authorId={comment.authorId._id}
                                targetId={storeId!}
                                createdAt={comment.createdAt}
                                content={comment.content}
                            />
                        ))}
                    </div>
                )}
            </div>
            <WriteReview />
        </div>
    );
}
