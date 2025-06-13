import Header from "../../components/header/Header";
import image_1 from "./../../img/steps/image1.png";
import image_2 from "./../../img/steps/image2.png";
import image_3 from "./../../img/steps/image 3.png";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Header />
      <div className="section">
        <div className="steps">
          <div className="step-container">
            <div className="step-label">Шаг 1</div>
            <div className="step">
              <img src={image_1} alt="заполнение" />
              <h3>Заполните данные</h3>
              <p>
                Заполните свои данные в форму, которая представлена на сайте.
              </p>
            </div>
          </div>
          <div className="step-container">
            <div className="step-label">Шаг 2</div>
            <div className="step">
              <img src={image_2} alt="щаблон" />
              <h3>Выберите шаблон</h3>
              <p>Например, который подходит под вашу профессию.</p>
            </div>
          </div>
          <div className="step-container">
            <div className="step-label">Шаг 3</div>
            <div className="step">
              <img src={image_3} alt="загрузка" />
              <h3>Загрузите резюме</h3>
              <p>Скачайте профессиональный макет в PDF. Все готово! </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
