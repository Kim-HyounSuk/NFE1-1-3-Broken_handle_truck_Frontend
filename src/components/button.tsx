import { useEffect, useState } from 'react';

interface SetData {
    defaultValue?: string[];
    setValue?: (value: string[]) => void;
    disabled?: boolean;
}

export default function Button({ defaultValue, setValue, disabled = false }: SetData) {
    const defaultButton = `flex gap-x-4 hover:shadow-lg border rounded-lg text-base justify-center ease-in duration-300 py-1.5 mx-auto w-[calc(100%-100px)] sm:w-[calc(100%-200px)] ${
        disabled ? 'pointer-events-none' : ''
    }`;

    // 선택된 버튼들을 저장하는 배열
    const [activeButtons, setActiveButtons] = useState<string[]>(defaultValue || []);

    // 버튼 클릭 시 실행되는 함수
    const handleButtonClick = (button: string) => {
        if (activeButtons.includes(button)) {
            // 이미 선택된 버튼이면 배열에서 제거
            setActiveButtons(activeButtons.filter((b) => b !== button));
        } else {
            // 선택되지 않은 버튼이면 배열에 추가
            setActiveButtons([...activeButtons, button]);
        }
    };

    useEffect(() => {
        if (setValue) setValue(activeButtons);
    }, [activeButtons, setValue]);

    useEffect(() => {
        setActiveButtons(defaultValue || []);
    }, [defaultValue]);

    return (
        <div className="flex flex-col gap-1 mx-auto w-[calc(100%-50px)] sm:w-[calc(100%-250px)] ">
            <p className="mb-2 text-xs text-white/50 mix-blend-difference tracking-tight">결제 방식</p>
            <div className="flex gap-x-2 text-2xl text-primary">
                <button
                    type="button"
                    onClick={() => handleButtonClick('현금')}
                    className={`${defaultButton} ${activeButtons.includes('현금') ? 'text-white bg-primary' : ''}`}
                >
                    현금
                </button>
                <button
                    type="button"
                    onClick={() => handleButtonClick('카드')}
                    className={`${defaultButton} ${activeButtons.includes('카드') ? 'text-white bg-primary' : ''}`}
                >
                    카드
                </button>
                <button
                    type="button"
                    onClick={() => handleButtonClick('계좌이체')}
                    className={`${defaultButton} ${activeButtons.includes('계좌이체') ? 'text-white bg-primary' : ''}`}
                >
                    계좌이체
                </button>
            </div>
        </div>
    );
}
