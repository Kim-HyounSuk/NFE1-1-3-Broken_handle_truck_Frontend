import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar.tsx';
import BottomNavBar from './BottomNavBar.tsx';
import useTitleStore from '../store/titleStore.ts';
import { useState } from 'react';
import Category from '../components/Category.tsx';

export default function RootLayout() {
    const { pathname } = useLocation();
    const [isOpenCategory, setIsOpenCategory] = useState(false);

    //store에 있는 상태를 가져온다
    const title = useTitleStore((state) => state.title);
    return (
        <div className="antialiased min-h-screen bg-black/30 flex justify-center">
            <div className="relative max-w-[768px] w-full min-h-screen bg-white flex flex-col justify-center">
                {/* 자식 라우트가 렌더링될 위치 */}
                {['/my-truck', '/detail', '/bookmark', '/register', '/notification'].includes(pathname) && (
                    <TopBar title={title} />
                )}
                <div className="flex-1">
                    <Outlet />
                </div>
                <Category isOpen={isOpenCategory} setOpen={setIsOpenCategory} />
                {!['/', '/login', '/signup', '/detail', '/register'].includes(pathname) && (
                    <BottomNavBar isOpenCategory={isOpenCategory} setOpenCategory={setIsOpenCategory} />
                )}
            </div>
        </div>
    );
}
