import React, { useState, useRef } from "react";
import { Carousel } from "@mantine/carousel";
import { images } from "../../../constants/images";
import { Image } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";

const Sliders = () => {
    const autoplay = useRef(Autoplay({ delay: 2000 }));

    const [data] = useState([
        images.slider_2,
        images.slider_1,
        images.slider_3,
        images.slider_4,
    ]);
    return (
        <Carousel
            withIndicators
            height={400}
            loop
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            withControls={false}
        >
            {data?.map((item, i) => (
                <Carousel.Slide key={i}>
                    <Image src={item} w="100%" h="100%" radius="sm" />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
};

export default Sliders;
