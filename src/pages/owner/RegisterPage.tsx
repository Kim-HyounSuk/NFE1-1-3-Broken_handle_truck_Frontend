import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useTitleStore from '../../store/titleStore';
import { useMyLocation } from '../../hooks/useMyLocation';
import InputSection from '../../components/register/InputSection';
import RegisterButton from '../../components/register/RegisterButton';
import useMyStore from '../../hooks/useMyStore.ts';

type Coordinates = [number, number];

export default function RegisterPage() {
	const { kakao } = window;
	const { data, isLoading } = useMyStore();
	const setTitle = useTitleStore((state) => state.setTitle);

	const [mapCenter, setMapCenter] = useState<Coordinates>([126.99581, 37.5563]); // 위치 설정
	const [position, setPosition] = useState<{ lat: number; lng: number }>({
		lat: 0,
		lng: 0,
	}); // 클릭한 위치에 마커 설정

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [address, setAddress] = useState<string>(''); // 주소
	const [name, setName] = useState<string>(''); // 가게 이름
	const [category, setCategory] = useState<string>(''); // 음식 카테고리
	const [payment, setPayment] = useState<string[]>([]); // 결제 방식

	const { myLocation } = useMyLocation(({ latitude, longitude }) => {
		setMapCenter([longitude, latitude]);
	});

	const getAddress = (lat: number, lng: number) => {
		const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
		const coord = new kakao.maps.LatLng(lat, lng); // 주소로 변환할 좌표 입력
		const callback = function (
			result: {
				address: kakao.maps.services.Address;
				road_address: kakao.maps.services.RoadAaddress | null;
			}[],
			status: kakao.maps.services.Status
		) {
			if (status === kakao.maps.services.Status.OK) {
				setAddress(result[0].address.address_name);
			}
		};
		geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
		// console.log(address); // 주소 출력
	};

	useEffect(() => {
		if (!isLoading) {
			setTitle('가게 등록');
			if (data?.store) {
				const { name, category, paymentMethod, isOpen, coordinates } = data.store;
				const [lon, lat] = coordinates;
				setName(name);
				setCategory(category);
				setPayment(paymentMethod);
				setIsOpen(isOpen);
				setMapCenter(coordinates);
				setPosition({ lat, lng: lon });
				getAddress(lat, lon);
			} else {
				myLocation();
			}
		}
	}, [isLoading]);

	return (
		<div className='h-full flex flex-col'>
			<div className='relative bg-review h-64 rounded-b-3xl'>
				<Map
					className='w-full h-full rounded-b-3xl'
					center={{ lat: mapCenter[1], lng: mapCenter[0] }}
					level={4}
					onClick={(_, mouseEvent) => {
						const latlng = mouseEvent.latLng;
						setPosition({
							lat: latlng.getLat(),
							lng: latlng.getLng(),
						});
						getAddress(latlng.getLat(), latlng.getLng());
					}}
				>
					{position && <MapMarker position={position} />}
				</Map>
			</div>
			<div className='flex-1'>
				<InputSection
					address={address}
					name={name}
					setName={setName}
					category={category}
					setCategory={setCategory}
					payment={payment}
					setPayment={setPayment}
				/>
			</div>
			<div className='sticky bottom-0 w-full bg-white z-10 border-t-1 border-comment'>
				<RegisterButton name={name} category={category} position={position} payment={payment} isOpen={isOpen} />
			</div>
		</div>
	);
}
