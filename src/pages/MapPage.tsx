import { useEffect, useRef, useState } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { useMyLocation } from '../hooks/useMyLocation';
import useUserStore from '../store/userStore';
import useStoresStore from '../store/storesStore';
import useMapLocationStore from '../store/mapLocationStore.ts';
import useNotificationStore from '../store/notificationStore.ts';
import useFetchStores from '../hooks/useFetchStores';
import Toggle from '../components/Toggle';
import Search from '../components/map/Search';
import MyLocation from '../components/map/MyLocation';
import Card from '../components/Card';
import MapMarker from '../components/map/MapMarker';
import { categories } from '../constants/categories';
import ReloadIcon from '../assets/images/reload.svg?react';
import type { IStore } from '../types/store';
import { toast } from 'react-toastify';

type Coordinates = [longitude: number, latitude: number];

type Marker = IStore & { commentCount: number };

export default function MapPage() {
    const { lat, lon, setLocation: setMapLocation } = useMapLocationStore();
    const { notificationList } = useNotificationStore();

    // 맵 옮겼는지 여부
    const [isMapMove, setIsMapMove] = useState(false);

    // 마커 클릭 여부
    const [clickMarker, setClickMarker] = useState<Marker | null>(null);

    // 초기 위치 설정
    const [mapCenter, setMapCenter] = useState<Coordinates>([126.99581, 37.5563]);

    const { user } = useUserStore();
    const { setLocation } = useStoresStore();
    const { stores, refetch, isLoading } = useFetchStores();

    const mapRef = useRef<kakao.maps.Map | null>(null);

    // useMyLocation 훅으로 현재 위치 받아오는 함수
    const { myLocation } = useMyLocation(({ latitude, longitude }) => {
        setMapCenter([longitude, latitude]);
    });

    const handleLocationChange = (coords: { latitude: number; longitude: number }) => {
        setMapCenter([coords.longitude, coords.latitude]);
        setMapLocation(coords.longitude, coords.latitude);
    };

    const updateStoreList = (lat: number, lon: number) => {
        setLocation(lon, lat);
        setIsMapMove(false);
    };

    const updateMapCenter = () => {
        if (mapRef.current) {
            const [longitude, latitude] = mapCenter;
            mapRef.current.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
            updateStoreList(latitude, longitude);
        }
    };

    const handleReloadStoreList = () => {
        if (mapRef.current) {
            const latlng = mapRef.current?.getCenter();
            if (latlng) {
                const longitude = latlng.getLng();
                const latitude = latlng.getLat();
                updateStoreList(latitude, longitude);
                setMapLocation(longitude, latitude);
            }
        }
    };

    const handleClickMapMaker = (data: Marker) => {
        new Promise((resolve) => {
            if (clickMarker) {
                setClickMarker(null);
            }
            return resolve('');
        }).finally(() => {
            setClickMarker(data);
        });
    };

    // 처음 로드될 때 내 위치로 이동
    useEffect(() => {
        if (!lon || !lat) {
            myLocation();
        } else {
            setMapCenter([lon, lat]);
        }
    }, []);

    // mapCenter가 업데이트될 때마다 지도 중심 이동
    useEffect(() => {
        updateMapCenter();
    }, [mapCenter]);

    // 알림이 발생하면 storeList 다시 불러오기
    useEffect(() => {
        refetch();
    }, [notificationList]);

    useEffect(() => {
        if (!isLoading && stores.length === 0) {
            toast.warn('주위에 검색 결과가 없습니다.');
        }
    }, [isLoading, stores]);

    return (
        <>
            <Map
                center={{ lat: mapCenter[1], lng: mapCenter[0] }}
                ref={mapRef}
                className="w-full h-full relative"
                level={4}
                onDragEnd={() => setIsMapMove(true)}
                onClick={() => setClickMarker(null)}
            >
                {stores.map((data) => (
                    <MapMarker
                        key={`${data.name}-${data._id}`}
                        // 나중에 임시데이터 지우면 data.category로 변경
                        category={categories.includes(data.category) ? data.category : '기타'}
                        coordinates={data.coordinates}
                        title={data.name}
                        onClick={() => handleClickMapMaker(data)}
                    />
                ))}

                <Search />
                {/* 맵을 이동한 경우 활성화 */}
                {isMapMove && (
                    <button
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-10 bg-white text-primary border-1 border-primary rounded-full px-4 py-2 text-xs shadow flex items-center gap-1"
                        onClick={handleReloadStoreList}
                    >
                        <ReloadIcon width={16} height={16} />
                        <span>현 지도에서 검색</span>
                    </button>
                )}
                {/* 영업 여부 토글은 로그인 여부에 따라서 달라짐 */}
                {clickMarker ? null : (
                    <div className="absolute flex items-center justify-between bottom-24 z-10 left-1/2 -translate-x-1/2 w-[calc(100%-50px)] sm:w-[calc(100%-200px)]">
                        <MyLocation setMapCenter={handleLocationChange} />
                        {user?.role === 'owner' && <Toggle text={{ on: '영업중', off: '영업 종료' }} />}
                    </div>
                )}

                {clickMarker ? (
                    <div className="absolute inset-x-1/2 -translate-x-1/2 bottom-24 z-10 w-[calc(100%-50px)] sm:w-[calc(100%-280px)] mx-auto ">
                        <Card
                            info={{
                                storeId: clickMarker._id,
                                category: clickMarker.category,
                                name: clickMarker.name,
                                visited: clickMarker.commentCount,
                                isOpen: clickMarker.isOpen,
                            }}
                            bg="black"
                        />
                    </div>
                ) : null}
            </Map>
        </>
    );
}
