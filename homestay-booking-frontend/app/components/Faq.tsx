"use client";

import { useState } from 'react';

type FaqItemProps = {
    question: string;
    answer: string;
    isOpen: boolean;
    toggleOpen: () => void;
};

const FaqItem = ({ question, answer, isOpen, toggleOpen }: FaqItemProps) => {
    return (
        <div className="border-b border-[#27548A]/20 last:border-b-0">
            <button
                className="w-full text-left py-4 px-2 flex justify-between items-center focus:outline-none"
                onClick={toggleOpen}
                aria-expanded={isOpen}
            >
                <h3 className="font-montserrat font-semibold text-[#183B4E] text-base sm:text-lg">{question}</h3>
                <svg
                    className={`w-5 h-5 text-[#27548A] transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 pb-4 px-2' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-[#183B4E]/80 font-montserrat text-sm sm:text-base">{answer}</p>
            </div>
        </div>
    );
};

export default function Faq() {
    const faqItems = [
        {
            question: "Giờ nhận phòng và trả phòng như thế nào?",
            answer: "Giờ nhận phòng tiêu chuẩn từ 14:00 và trả phòng trước 12:00. Một số homestay có hỗ trợ linh hoạt theo tình trạng phòng."
        },
        {
            question: "Fishsauce Homestay có những khu vực nào tại Hà Nội?",
            answer: "Hệ thống hiện có các lựa chọn tại khu phố cổ, Tây Hồ, Long Biên, Sóc Sơn, Ba Vì, Gia Lâm và Hà Đông."
        },
        {
            question: "Làm sao để chọn homestay phù hợp?",
            answer: "Bạn chỉ cần cho chúng tôi biết số lượng khách, ngân sách, khu vực mong muốn và mục đích chuyến đi, đội ngũ sẽ gợi ý danh sách phù hợp."
        },
        {
            question: "Giá thuê homestay khoảng bao nhiêu?",
            answer: "Giá dao động theo khu vực, ngày trong tuần/cuối tuần và số lượng khách. Liên hệ để nhận báo giá cập nhật theo nhu cầu của bạn."
        },
        {
            question: "Có hỗ trợ đoàn đông hoặc công ty không?",
            answer: "Có. Fishsauce Homestay hỗ trợ đặt nhiều căn cùng lúc cho nhóm bạn, gia đình lớn hoặc đoàn công ty."
        },
        {
            question: "Có thể đặt homestay gần danh lam thắng cảnh không?",
            answer: "Có. Chúng tôi có nhiều lựa chọn gần Hồ Gươm, Hồ Tây, phố cổ, Ba Vì, Sóc Sơn và các điểm tham quan nổi bật khác."
        },
        {
            question: "Chính sách hủy/đổi lịch như thế nào?",
            answer: "Mỗi căn có chính sách riêng theo đối tác. Trước khi xác nhận, chúng tôi luôn gửi rõ chính sách để bạn chủ động kế hoạch."
        },
        {
            question: "Đặt phòng bằng cách nào nhanh nhất?",
            answer: "Bạn có thể gọi trực tiếp hotline (+84) 847-318-696 để được tư vấn và xác nhận đặt phòng nhanh nhất."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#F5EEDC]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-playfair font-bold text-[#183B4E] mb-4">Thông Tin Đặt Homestay</h2>
                    <p className="text-[#183B4E] font-montserrat max-w-2xl mx-auto font-bold">
                        Những thông tin quan trọng trước khi bạn đặt Fishsauce Homestay quanh Hà Nội.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {faqItems.map((item, index) => (
                        <FaqItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            toggleOpen={() => toggleFaq(index)}
                        />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[#183B4E]/90 font-montserrat text-sm">
                        Có câu hỏi khác? Liên hệ với chúng tôi tại <br/>{' '}
                        <a
                            href="tel:+84847318696"
                            className="text-[#27548A] font-semibold hover:text-[#183B4E] transition-colors duration-300"
                        >
                            (+84) 847-318-696
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
} 