import Input from '../Input';
import Select from '../Select';
import Button from '../button';

interface InputSectionProps {
    name: string;
    setName: (name: string) => void;
    address: string;
    category: string;
    setCategory: (category: string) => void;
    payment: string[];
    setPayment: (payment: string[]) => void;
}

export default function InputSection({
    name,
    setName,
    address,
    category,
    setCategory,
    payment,
    setPayment,
}: InputSectionProps) {
    return (
        <div className="flex flex-col gap-y-5 my-10">
            <div className="mx-auto w-[calc(100%-50px)] sm:w-[calc(100%-250px)] flex flex-col gap-y-5 ">
                <Input
                    id="location"
                    label="가게 위치"
                    placeholder="가게 위치를 지도에서 클릭해주세요"
                    value={address}
                    readOnly
                />
                <Input id="name" label="가게 이름" placeholder="가게 이름" setValue={setName} value={name} />
                <Select defaultValue={category} setValue={setCategory} />
            </div>
            <Button defaultValue={payment} setValue={setPayment} />
        </div>
    );
}
