type BrandCardProps = {
    name: string;
    imageUrl?: string;
    onClick?: () => void;
};

const BrandCard: React.FC<BrandCardProps> = ({ name, imageUrl, onClick }) => {
    // Nếu không có imageUrl hoặc không hợp lệ, sử dụng placeholder
    const imageSrc = imageUrl && imageUrl.trim() !== '' ? imageUrl : `https://placehold.co/150x150?text=${encodeURIComponent(name.substring(0, 2).toUpperCase())}`;
    
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer select-none"
            style={{ width: '100%' }}
        >
            <div className="w-full aspect-[4/3] overflow-hidden rounded-md border border-[#E5E7EB] bg-white flex items-center justify-center">
                <img
                    src={imageSrc}
                    alt={name}
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={(e) => {
                        // Nếu hình ảnh bị lỗi, hiển thị placeholder
                        e.currentTarget.src = `https://placehold.co/150x150?text=${encodeURIComponent(name.substring(0, 2).toUpperCase())}`;
                    }}
                />
            </div>
            <div className="mt-2 text-center text-sm font-medium text-[#111827]">
                {name}
            </div>
        </div>
    );
};

export default BrandCard;

