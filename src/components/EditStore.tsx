import { toast } from 'react-toastify';
import { deleteStore } from '../apis/store.ts';
import useFadeNavigate from '../hooks/useFadeNavigate.ts';
import useMyStore from '../hooks/useMyStore.ts';
import useUserStore from '../store/userStore.ts';

export default function EditStore() {
    const navigate = useFadeNavigate();
    const { refetch } = useMyStore();
    const { setRole } = useUserStore();

    const handleDeleteStore = () => {
        deleteStore().then((data) => {
            if (data.msg === 'ok') {
                refetch().then(() => {
                    setRole('user');
                    toast.success('정상적으로 삭제되었습니다.');
                });
            }
        });
    };

    return (
        <div className="border-t-1 bg-white border-comment">
            <div className="w-[calc(100%-50px)] sm:w-[calc(100%-250px)] mx-auto pt-5 pb-5 flex gap-x-2">
                <button
                    className="bg-secondary flex-1 py-5 rounded-lg tracking-tighter font-semibold"
                    onClick={() => navigate(`/register`, { replace: true })}
                >
                    내 가게 수정하기
                </button>
                <button
                    className="border-1 border-placeholder text-placeholder flex-1 py-5 rounded-lg tracking-tighter font-semibold"
                    onClick={handleDeleteStore}
                >
                    가게 삭제하기
                </button>
            </div>
        </div>
    );
}
