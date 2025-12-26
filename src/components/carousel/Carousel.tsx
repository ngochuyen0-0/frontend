import React from "react";
import { Carousel as AntCarousel } from "antd";

type Slide = {
    id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
};

type CarouselProps = {
    slides: Slide[];
    autoplay?: boolean;
};

const Carousel: React.FC<CarouselProps> = ({ slides, autoplay = true }) => {
    return (
        <div className="overflow-hidden rounded-lg">
            <AntCarousel autoplay={autoplay} dots>
                {slides.map((slide) => (
                    <div key={slide.id}>
                        <div className="relative h-[360px] md:h-[440px] lg:h-[520px] w-full">
                            <img
                                src={slide.imageUrl}
                                alt={slide.title || "slide"}
                                className="h-full w-full object-cover"
                            />
                            {(slide.title || slide.subtitle) && (
                                <div className="absolute inset-0 bg-black/20 flex flex-col items-start justify-center px-8 md:px-16">
                                    {slide.title && (
                                        <h3 className="text-white text-2xl md:text-4xl font-semibold mb-2">
                                            {slide.title}
                                        </h3>
                                    )}
                                    {slide.subtitle && (
                                        <p className="text-white/90 text-sm md:text-base max-w-xl">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </AntCarousel>
        </div>
    );
};

export default Carousel;

