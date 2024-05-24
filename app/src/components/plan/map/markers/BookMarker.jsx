import React from 'react';

function BookMarker({color}) {
    return (
        <svg width="59" height="59" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
            <g clip-path="url(#clip0_710_882)">
                <path d="M29.5 0.103271C22.9951 0.110428 16.7587 2.69749 12.1588 7.29692C7.55887 11.8963 4.97119 18.1325 4.96338 24.6374C4.96338 30.9554 9.85546 40.8428 19.5044 54.0244C20.6531 55.598 22.1571 56.8782 23.894 57.7608C25.6309 58.6434 27.5517 59.1034 29.5 59.1034C31.4483 59.1034 33.3691 58.6434 35.106 57.7608C36.8429 56.8782 38.3469 55.598 39.4956 54.0244C49.1445 40.8428 54.0366 30.9554 54.0366 24.6374C54.0288 18.1325 51.4411 11.8963 46.8412 7.29692C42.2414 2.69749 36.0049 0.110428 29.5 0.103271ZM29.5 34.4167C27.5552 34.4167 25.654 33.84 24.0369 32.7595C22.4198 31.679 21.1595 30.1432 20.4152 28.3464C19.6709 26.5496 19.4762 24.5724 19.8556 22.665C20.235 20.7575 21.1716 19.0054 22.5468 17.6301C23.922 16.2549 25.6741 15.3184 27.5816 14.939C29.4891 14.5595 31.4663 14.7543 33.2631 15.4985C35.0599 16.2428 36.5956 17.5032 37.6761 19.1202C38.7566 20.7373 39.3333 22.6385 39.3333 24.5834C39.3333 27.1913 38.2973 29.6925 36.4532 31.5366C34.6091 33.3807 32.108 34.4167 29.5 34.4167Z" fill={color}/>
                <circle cx="29" cy="22" r="14" fill={color}/>
                <rect x="16" y="9" width="27" height="27" fill="url(#pattern0_710_882)"/>
            </g>
            <defs>
                <pattern id="pattern0_710_882" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use href="#image0_710_882" transform="scale(0.0078125)"/>
                </pattern>
                <clipPath id="clip0_710_882">
                    <rect width="59" height="59" fill="white"/>
                </clipPath>
                <image id="image0_710_882" width="128" height="128" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAjhSURBVHic7Z1rrFVHGYaf7xwuLVAontJyMa2npIqlXBqxoCZWqjVN1GilYNNCsVZpqYlGQoBEjT/USDWxidFakxrbWkoVqkaNRltr4q1FYgURUMBSQKCUSotwyu1wXn/M2rI9nr332nutfTvzPcnKvqw1M983885lzUwy4DiO4ziO4ziO4ziO4ziO4ziO4ziO4wxCLGsEkgxYDNwGXJb8fQI4mVxHgAPJtR94Afgb8JyZKWv6g4EkDy8HpgDjgUnAxOTqAoYD5wHnJ0H2AA8BD2fNw0wCkNQBrAFuriH4MWBz0bUR+IuZ9WWxqdVJ8mwGMAuYmXyfDlxQQ3RrgYVNyzNJdytfDkv6vqTbJXU1xak6IKlL0kckrZP0Us55dlczHduUszPFnJH0hKTbJI1ompM1ImmEpMWSnkx8qRfPZrEzaxdwgtA31ZujhK7mXjPb1YD0akbSFcCngFuAMQ1I8oSZNaeCSOqto7IHolfSY5JmNMXhMkiaIel7ks42Ok+y2J21BegFOrPEUWvSwHpguZntbUL65wyRJgKfA+6gOXlx1syG1Bq4I09LGogB84GtkpYpjKwbiqROScuBHcASmlP4mWnXFqA/TwMfNrMdjUhMUjfwHeDaRqRXgShbgP68BfiTpHn1TkjSfGALrVH4mRksAgAYBayTtLoeXYIkk7QSeAwYmXf8zWKwdAH9eRRYbGaZRsgFJA0FHgEW5BFfzngXMAC3AGuTgsuEpGGEWt+KhZ+ZwSoAgJsIIqjZR0mdhML/YG5WtRiDWQAA84DVGcJ/BbgxJ1takv8bA0gaCQxLfvaZ2dFSgVt4DNCfpWZ2fzUBJN0BPFAne/Kk7BhA0hjOVfTTZtZTfL8jeWhkMnp+AThOWMM/Amyvj80N52uSZqV9WNLVwH11tKeRbOdceR6XdFDSl5QssFny5Slg9gCBD5rZxFIxt1ELALANeJOZnSz3kKThhL0J0xpiVXYqtQAHgAkD3HoGuK4DWMnAhT/YuBL4fIrnvkD7FH4W5gArTNIuYHKJhwZTCwBwBug2s/0D3ZQ0AXiec2OgdqDWFgBgZwfwunpY1aIMBd5e5v5c2qvws9LdQXvV4DwYX+beJQ2zojUYMtjnAQai3PR35l3S7UaMAnCKcAFEjgsgclwAkeMCiBwXQOS4ACLHBRA5LoDIcQFEjgsgclwAkeMCiBwXQOS4ACLHBRA5LoDIcQFEjgsgclwAkeMCiBwXQOS4ACLHBRA5LoDIcQFEjgsgclwAkeMCiBwXQOS4ACLHBRA5LoDIcQFEjgsgclwAkeMCiBwXQOS4ACLHBRA5LoDIcQFEjgsgclwAkeMCiBwXQOS4ACLHBRA5LoDIcQFETiUBVDp8+Uxehjg1U6kMypZhJQF0VTiBe2eF8E79+XupG8nJ513lAlcSgAElzw0Evl0hvFN/yp1vPIkKB2GlGQNcV+be14EfpYjDqQ8/AL5Z5v47K0WQRgAfKHXDzM4CNwFLgQ3AS0Bvijid2ugl5PEG4E5gflIGpXh/pQhLHjlaxHskXWlm2wa6mRhwf3L9l+QQ5hHABYRuZBxwMeEY08mEs3ynAKNT2DCYOUrox7cB/wAOAi8Ch4EDwDHgVTM7VU2kkqYAN1R6Lo0AOoEvAjdWY0Bi8CngZWBvqeckvZYghDcD1wJvA0ZVk1YbcRz4HfAbwgnl20udY5wDXyZN+So9d9XJ0P72DJE0R9JKSb+QdLoKG9OwrEzay3JO65SCDyskzZaUpsLlkYd3pzWwGgGclvTuRjjQz5mxkhZJ+qmk3irsLUW9BXBG0k8kLZR0YSPzKvHhBlVRaaoRQMG5TzTaqSLnJkpaJen5Ku0upl4C2K3QapU6qr3uSFqiKlvMagVQ4GeSpjXR0SGSPiRpYw225y2ADZIWSGraKeySpkv6eQ221ywASTor6ZcK/c1USU0ZzUt6l6Rnq7A7LwH8VdJ8SQ0/cVzSaElXSfq4pCeSsqiJLIOSDuD65CoY1gOcJrza9AE9hFeaQ4T314PAjuTaWe2rzUCY2ZOSZgGLCCPfi7PGWYFDwArgETPryyNCSecBVwCvTz4nABcBlxD8GUnI7zHAsOR3LuQ9Kh2ZXGNTPNsnaQ/wR+APwO+BzWZW9URSUhAPSfox4ZX1TvJf6ewjzLp9xsxeqTWSpNLNBN5KeOW9BriUZq3M1tp01IljCuOLj0q6KINPcyXtK5FGLV3AXknvyGDPOEkfU+inj+eaYxlpNQEU0yvpVwpjjKpfpyS9RtLjA8RbrQDWSUrTovWPa6xCH/2U8nl9rQutvCGkk7AQ9Q1gn6RvSXpD2sBmdoSwTrGK0HxXi4B7gAVm9nLqQFK3pNXAbsJi2VyCLy1JKwugmFHAEmCrpPWSZqcJZGYys3uABcCrVaTXA8wzs1VmpjQBFGYv1wO7gJWEAVvL0y4CKNAJzAOeUZhtm5wmkJk9TlgY+XeKx3uA95nZD9PELelSSQ8TBrLzaLM8bStj+/FeQovwaZXftQSAmf2WsD5+pMxjrwDXm9mvK8UnaaikzxJeaRdRYeNFq2KSTgLDm21IRjYBt5Zasi5GkpVq1svd6/fcVGANMKNqS1uLUyZpMzC9TgkUNjAUXyKscfcSlouL++ZRhE2MownN/YXA+YStTZMIkyCl6AGWmtl383Xhf5G0GLiPsNehFKcIa/n7gROEluUsoQs6Q1gWLjCCUAGHEvw3wiRQ4RpH/QaRm0zSUoJDtfAi8BxhxFv43E1w/rCZ/SsXMxMkjSdsLplEmDy5DLgKmJr8BrgXWJ7XLF1R2h3AV4FPJn/tIWzi2JJ830co8P1mdijntAtimAh0A5cnn4Xvtc5+LrXEsTXAzWUePEZoZrcSHN4KbEletVoCSWMIs2pzgH8CD6YdwaeI24DbCcJ7GthoZkfziDsPJHVxriJMSz5nEnZjlWItsNCSCAy4FVhMUNVh4M+EadrCzpVca5RTX5KK/UbCTqtrgKsJ3clu4EHg0bwqiOM4juM4juM4juM4juM4juM4juM4jtNy/Acmd5bWMaJG7QAAAABJRU5ErkJggg=="/>
            </defs>
        </svg>
    );
}

export default BookMarker;
