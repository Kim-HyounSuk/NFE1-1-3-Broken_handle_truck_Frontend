import React from 'react';
import { INotification } from '../types/notification';
import Icon from '../assets/images/defaultMenu.svg?react';

interface MessageProps {
    data: INotification;
    ImgComponent?: React.FC<{ width?: number; height?: number }>;
    onClick: () => void;
}

export default function Message({ data, ImgComponent = Icon, onClick }: MessageProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center py-5 px-5 bg-white drop-shadow-lg rounded-lg cursor-pointer hover:bg-form"
        >
            <div className="">
                <ImgComponent width={45} height={45} />
            </div>
            <div className="flex-1 flex flex-col px-3 tracking-tighter text-sm sm:text-base">
                <div>{`${data.sender.name}이 영업을 ${data.type === 'open' ? '시작' : '마감'}했습니다.`}</div>
                <div className="text-xs sm:text-sm text-category">{data.createdAt}</div>
            </div>
            <div className="flex justify-end">
                <div className={`w-2 h-2 rounded-full ${data.type === 'open' ? 'bg-success' : 'bg-category'}`}></div>
            </div>
        </div>
    );
}
