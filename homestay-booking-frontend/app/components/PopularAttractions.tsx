import Image from "next/image";
import Link from "next/link";

type AttractionProps = {
    title: string;
    description: string;
    distance: string;
    imagePath: string;
    linkUrl?: string;
    altText: string;
};

const Attraction = ({ title, description, distance, imagePath, linkUrl, altText }: AttractionProps) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative h-40 sm:h-48 w-full">
                <div className="absolute inset-0 bg-[#F5EEDC]/50 flex items-center justify-center">
                    <p className="text-[#183B4E] text-sm font-medium">Image placeholder: {title}</p>
                </div>
                {/*Image Placeholder*/}
                {<Image
                    src={imagePath}
                    alt={altText}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />}
            </div>

            <div className="p-3 sm:p-4">
                <div className="mb-1.5 sm:mb-2">
                    <div className="flex justify-end mb-1">
                        <span className="text-xs bg-[#F5EEDC] text-[#183B4E] px-2 py-1 rounded-full font-montserrat font-medium whitespace-nowrap">
                            {distance}
                        </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-playfair font-semibold text-[#27548A] leading-tight">{title}</h3>
                </div>
                <p className="text-[#183B4E]/80 text-xs sm:text-sm font-montserrat mb-3 sm:mb-4">{description}</p>

                {linkUrl && (
                    <Link
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#27548A] text-sm font-semibold hover:text-[#183B4E] transition-colors duration-300 flex items-center"
                    >
                        Xem Trên Maps
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default function PopularAttractions() {
    const attractions = [
        {
            title: "Homestay Hồ Tây View",
            description: "Không gian gần Hồ Tây, thuận tiện di chuyển tới phố cổ và các quán cafe nổi tiếng.",
            distance: "15 phút từ phố cổ",
            imagePath: "/attractions/muzium-padi.jpg",
            linkUrl: "https://maps.app.goo.gl/UGVGLcRbS2Ke24A27",
            altText: "Homestay Hồ Tây Hà Nội gần khu trung tâm"
        },
        {
            title: "Homestay Phố Cổ Hà Nội",
            description: "Nằm trong khu vực phố cổ, phù hợp cho khách muốn khám phá văn hóa và ẩm thực Hà Nội.",
            distance: "5 phút tới Hồ Gươm",
            imagePath: "/attractions/menara-alor-setar.jpg",
            linkUrl: "https://maps.app.goo.gl/2nn1HfkReHJ1XbyF9",
            altText: "Homestay khu phố cổ Hà Nội"
        },
        {
            title: "Homestay Long Biên Riverside",
            description: "Không gian yên tĩnh gần sông Hồng, thuận tiện đi Bát Tràng và cầu Long Biên.",
            distance: "20 phút từ trung tâm",
            imagePath: "/attractions/masjid-zahir.jpg",
            linkUrl: "https://maps.app.goo.gl/ePegdcqnQ2xLJ8i47",
            altText: "Homestay khu Long Biên Hà Nội"
        },
        {
            title: "Homestay Sóc Sơn Pine Hill",
            description: "Phong cách nghỉ dưỡng ngoại thành với nhiều cây xanh, gần Việt Phủ Thành Chương.",
            distance: "45 phút từ nội thành",
            imagePath: "/attractions/bukit-kokdiang.jpg",
            linkUrl: "https://maps.app.goo.gl/8WjugKsa97W741wZA",
            altText: "Homestay khu Sóc Sơn Hà Nội"
        },
        {
            title: "Homestay Ba Vì Mountain",
            description: "Lựa chọn phù hợp cho nhóm bạn và gia đình muốn gần Vườn Quốc gia Ba Vì.",
            distance: "70 phút từ trung tâm",
            imagePath: "/attractions/dataran-balai-besar.jpg",
            linkUrl: "https://maps.app.goo.gl/ChCUyENGBrDyH9To6",
            altText: "Homestay khu Ba Vì Hà Nội"
        },
        {
            title: "Homestay Gia Lâm Garden",
            description: "Không gian xanh mát tại Gia Lâm, phù hợp nghỉ cuối tuần và đi làng gốm Bát Tràng.",
            distance: "30 phút từ nội thành",
            imagePath: "/attractions/pekan-rabu.jpg",
            linkUrl: "https://maps.app.goo.gl/PsTwarEm127RkoK36",
            altText: "Homestay khu Gia Lâm Hà Nội"
        },
        {
            title: "Homestay Hoài Đức Countryside",
            description: "Mô hình homestay sân vườn gần trung tâm Mỹ Đình, thuận tiện đi đại lộ Thăng Long.",
            distance: "35 phút từ trung tâm",
            imagePath: "/attractions/hospital-sultanah-bahiyah.jpg",
            linkUrl: "https://maps.app.goo.gl/PMANWERJTUxZqBzB9",
            altText: "Homestay khu Hoài Đức Hà Nội"
        },
        {
            title: "Homestay Đông Anh Airport Stay",
            description: "Phù hợp khách công tác hoặc transit, dễ kết nối sân bay Nội Bài và trung tâm Hà Nội.",
            distance: "15 phút tới Nội Bài",
            imagePath: "/attractions/lapangan-terbang.jpg",
            linkUrl: "https://maps.app.goo.gl/2tviEyF1njjzG73P9",
            altText: "Homestay khu Đông Anh gần sân bay Nội Bài"
        },
        {
            title: "Homestay Hà Đông Urban",
            description: "Căn hộ homestay hiện đại, tiện kết nối Aeon Mall Hà Đông và tuyến metro Cát Linh - Hà Đông.",
            distance: "25 phút tới trung tâm",
            imagePath: "/attractions/aman-central-mall.jpg",
            linkUrl: "https://maps.app.goo.gl/U9eDFwuWr8qg6ioW9",
            altText: "Homestay khu Hà Đông Hà Nội"
        }
    
        
    ];

    return (
        <section id="nearby" className="py-10 sm:py-16 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#F5EEDC]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-[#183B4E] mb-3 sm:mb-4">Những homestay phổ biến</h2>
                    <p className="text-sm sm:text-base text-[#183B4E] font-montserrat max-w-2xl mx-auto font-bold">
                        Gợi ý homestay được đặt nhiều quanh Hà Nội, từ nội thành tới ngoại thành, thuận tiện tham quan các danh lam thắng cảnh.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {attractions.map((attraction, index) => (
                        <Attraction
                            key={index}
                            title={attraction.title}
                            description={attraction.description}
                            distance={attraction.distance}
                            imagePath={attraction.imagePath}
                            linkUrl={attraction.linkUrl}
                            altText={attraction.altText}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 