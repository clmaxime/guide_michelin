import article1 from "../../assets/images/site/article_1.webp";
import article2 from "../../assets/images/site/article_2.webp";
import article3 from "../../assets/images/site/article_3.webp";
import article4 from "../../assets/images/site/article_4.webp";
import cardHotel from "../../assets/images/site/card_hotel.webp";
import cardRestaurant from "../../assets/images/site/card_restaurant.webp";
import destFrance from "../../assets/images/site/dest_france.webp";
import destItaly from "../../assets/images/site/dest_italy.webp";
import destJapan from "../../assets/images/site/dest_japan.webp";
import destSpain from "../../assets/images/site/dest_spain.webp";
import destThailand from "../../assets/images/site/dest_thailand.webp";
import destUsa from "../../assets/images/site/dest_usa.webp";
import heroBackground from "../../assets/images/site/hero_background_hd.webp";
import heroDetail from "../../assets/images/site/hero_detail.webp";
import heroDish from "../../assets/images/site/hero_dish.webp";
import heroWine from "../../assets/images/site/hero_wine.webp";
import inspiration1 from "../../assets/images/site/inspiration_1.webp";
import inspiration2 from "../../assets/images/site/inspiration_2.webp";
import inspiration3 from "../../assets/images/site/inspiration_3.webp";
import inspiration4 from "../../assets/images/site/inspiration_4.webp";
import iconCalendar from "../../assets/images/site/icon_calendar.svg";
import iconHeart from "../../assets/images/site/icon_heart.svg";
import iconLocation from "../../assets/images/site/icon_location.svg";
import iconPerson from "../../assets/images/site/icon_person.svg";

export const heroAssets = {
  background: heroBackground,
  dish: heroDish,
  wine: heroWine,
  detail: heroDetail,
};

export const headerLinks = ["Restaurants", "Hotels", "Inspiration", "Destinations"];

export const searchFields = [
  { key: "destination", icon: iconLocation, label: "Destination" },
  { key: "date", icon: iconCalendar, label: "Date" },
  { key: "guests", icon: iconPerson, label: "Personnes" },
];

export const categoryCards = [
  {
    image: cardRestaurant,
    title: "Restaurants",
    text: "Explorez les tables etoilees et bistronomiques.",
  },
  {
    image: cardHotel,
    title: "Hotels",
    text: "Retrouvez les adresses remarquables et design.",
  },
];

export const inspirationCards = [
  { image: inspiration1, title: "Nouvelles distinctions Michelin" },
  { image: inspiration2, title: "Tables iconiques en lumiere" },
  { image: inspiration3, title: "Voyages gourmands en train" },
  { image: inspiration4, title: "Hotels d'exception et vues uniques" },
];

export const articleCards = [
  { image: article1, title: "Portrait de cheffe", excerpt: "Rencontre avec Alice Roca." },
  { image: article2, title: "48h a Copenhague", excerpt: "Carnet d'adresses entre gastronomie et design." },
  { image: article3, title: "Terrasses d'Europe", excerpt: "Nos spots pour diner avec panorama." },
  { image: article4, title: "Cuisine zero dechet", excerpt: "Des chefs qui reinventent les gestes durables." },
];

export const destinationCards = [
  { image: destFrance, title: "France" },
  { image: destItaly, title: "Italie" },
  { image: destJapan, title: "Japon" },
  { image: destSpain, title: "Espagne" },
  { image: destUsa, title: "Etats-Unis" },
  { image: destThailand, title: "Thailande" },
];

export const footerSocials = ["Instagram", "Facebook", "X", "YouTube"];
export const favoriteIcon = iconHeart;
