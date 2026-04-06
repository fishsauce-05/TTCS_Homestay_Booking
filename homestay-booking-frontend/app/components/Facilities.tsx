import Image from "next/image";

type FacilityProps = {
    title: string;
    description: string;
    imagePath: string;
    altText: string;
};

const Facility = ({ title, description, imagePath, altText }: FacilityProps) => {
    return (
        <div className="flex flex-col items-center p-3 sm:p-4 bg-white/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative w-full h-48 sm:h-56 md:h-70 mb-3 sm:mb-4 overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-[#F5EEDC]/50 flex items-center justify-center">
                    <p className="text-[#183B4E] text-sm font-medium">Image placeholder: {title}</p>
                </div>
                {/* Image component with hover effect */}
                {<Image
                    src={imagePath}
                    alt={altText}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />}
            </div>
            <h3 className="text-lg sm:text-xl font-playfair font-semibold text-[#27548A] mb-1 sm:mb-2">{title}</h3>
            <p className="text-center text-[#183B4E] font-montserrat text-xs sm:text-sm">{description}</p>
        </div>
    );
};

export default function Facilities() {
    const facilitiesList = [
        {
            title: "Bể Bơi",
            description: "Thưḝng thức khoảng thời gian thư giãn bơi lặn ở bể bơi dành cho người lớn và trẻ em.",
            imagePath: "/facilities/kolam.jpg",
            altText: "Bể bơi riêng tư sạch sẽ với nước trong lành ở nhà ở gia đình Tuah Suci Kedah"
        },
        {
            title: "Nhà Bếp Nấu Nước",
            description: "Nhà bếp đầy đủ tiện nghi kèm theo tỪnh lạnh để tiền lợi cho khách.",
            imagePath: "/facilities/dapur.jpg",
            altText: "Nhà bếp hoàn chỉnh với dụng cụ nấu ăn hiện đại và tủ lạnh lớn ở homestay Pokok Sena"
        },
        {
            title: "Vùng Cảnh Đồng Lú",
            description: "Thưḝng thức trải nghiệm độc đáo với tầm nhìn cánh đồng lú xanh tươm xung quanh homestay.",
            imagePath: "/facilities/padi.jpg",
            altText: "Tàm nhìn cảnh đồng lú xanh nó bao quanh hôm nghĩ quê hương ở Kedah"
        },
        {
            title: "Không Gian Thư Giãn",
            description: "Khu vực nước lạnh để thư giãn và tận hưởng không khí quê hương và tầm nhìn hồ bơi.",
            imagePath: "/facilities/santai.jpg",
            altText: "Khu vực thư giãn ngoài trời thoải mái với tầm nhìn hồ bơi ở nhà ở sang trọng Kedah"
        },
        {
            title: "Tiện Nghi Nướng Thịt",
            description: "Khu vực đặc biệt để hoạt động nướng thịt với tiện nghi đầy đủ.",
            imagePath: "/facilities/bbq.jpg",
            altText: "Khu vực nướng thịt đầy đủ với vỉ nướng và bàn cho gia đình ở homestay Tuah Suci"
        },
    ];

    return (
        <section id="facilities" className="py-10 sm:py-16 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#F5EEDC]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-[#183B4E] mb-3 sm:mb-4">Tiện Nghi & Cơ Sở Vật Chất</h2>
                    <p className="text-sm sm:text-base text-[#183B4E] font-montserrat max-w-2xl mx-auto font-bold">
                        Thưḝng thức nhiều tiện nghi và cơ sở được cung cấp để đảm bảo lưu trú của bạn thoải mái và vui vẻ.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {facilitiesList.map((facility, index) => (
                        <Facility
                            key={index}
                            title={facility.title}
                            description={facility.description}
                            imagePath={facility.imagePath}
                            altText={facility.altText}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}