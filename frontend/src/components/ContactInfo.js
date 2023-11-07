// ContactInfo.js
import React from "react";
import envelopeImg from "../images/envelope.svg";
import pinImg from "../images/map-pin.svg";

const ContactInfo = () => {
  return (
    <div className="w-container">
      <div className="w-row">
        <div className="contact-info-column w-col w-col-4">
          <h2 className="heading">
            A MedConnect Solutions é uma empresa inovadora no ramo da tecnologia
            da saúde
          </h2>
          <img src={envelopeImg} alt="Envelope" className="contact-icon" />
          <div className="contact-text">contact@medconnect.com</div>
          <img src={pinImg} alt="Map Pin" className="contact-icon" />
          <div className="contact-text">
            Rua Harmonia, 1234
            <br />
            Vila Madalena, São Paulo - SP, <br />
            Brasil
          </div>
        </div>
        <div className="contact-form-column w-col w-col-8">
          <p className="paragraph">
            Especializada no desenvolvimento de software robusto e integrado para
            gestão de clínicas e consultórios. Nosso produto principal é uma
            plataforma intuitiva que simplifica o agendamento de consultas,
            otimiza o gerenciamento de prontuários eletrônicos e automatiza
            processos administrativos, assegurando uma operação eficiente e um
            atendimento de excelência aos pacientes.
            <br />
            <br />
            Com foco em acessibilidade e interoperabilidade, a MedConnect Solutions
            oferece uma solução completa que engloba desde o primeiro contato do
            paciente para marcar uma consulta até o acompanhamento pós-atendimento,
            integrando-se com sistemas de laboratório e outras plataformas de saúde.
            Nosso compromisso é proporcionar uma experiência fluida tanto para os
            profissionais de saúde quanto para os pacientes, aliando tecnologia de
            ponta a um suporte especializado para transformar a maneira como as
            clínicas operam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
