import imagee from "./../../img/images/image 21.png";
import "./../about/About__site.css";
const About_site = () => {
  return (
    <>
      <main>
        <section className="hero">
          <div className="container">
            <p className="hero-text">
              <strong>Наша цель проста</strong> - сделать важнейший этап поиска
              работы простым, понятным и доступным. Ваше резюме - это первое,
              что видит потенциальный работодатель, и мы знаем, что у вас не
              будет второго шанса произвести первое впечатление.
            </p>
          </div>
        </section>

        <section className="main-content">
          <div className="container">
            <div className="line"></div>
            <h2 className="main-title">
              Ваш надежный помощник при поиске работы
            </h2>
            <img src={imagee} alt="Hero" className="hero-image" />

            <p className="description">
              Если вы считаете, что составление резюме — это сложный и
              запутанный процесс, то спешим вас уверить: с нашим
              онлайн-конструктором это стало как никогда легко и удобно! Каждый
              шаг формы направлен на то, чтобы помочь вам раскрыть свои сильные
              стороны. Вы сможете ввести свои данные, перечислить свои
              достижения и описать опыт работы, даже если у вас его не так
              много.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default About_site;
