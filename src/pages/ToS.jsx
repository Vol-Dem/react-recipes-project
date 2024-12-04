import { useEffect } from "react";
import LinkA from "../components/ui/LinkA";
import classes from "./ToS.module.scss";
import { NavLink } from "react-router-dom";
import Card from "../components/ui/Card";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../variables/constants";

const ToS = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
    >
      <Card className={classes.tos}>
        <h1 className={classes["tos__h1"]}>Terms of Service</h1>
        <p className={classes["tos__text"]}>
          Welcome to "Your recipe book" web application ("Website"). These Terms
          of Service ("Terms") govern your access to and use of our website,
          products, and services ("Services"). By accessing or using our
          Services, you agree to be bound by these Terms. If you do not agree,
          please do not use our Services.
        </p>
        <h4 className={classes["tos__h4"]}>
          1. <strong>Acceptance of Terms</strong>
        </h4>
        <p className={classes["tos__text"]}>
          By accessing or using Website, you confirm that you are at least the
          age of majority in your jurisdiction or have obtained parental consent
          to use our Services.
        </p>
        <h4 className={classes["tos__h4"]}>
          2. <strong>Modifications to Terms</strong>
        </h4>
        <p className={classes["tos__text"]}>
          We reserve the right to modify these Terms at any time. Changes will
          be effective immediately upon posting. It is your responsibility to
          review the Terms periodically for updates. Continued use of the
          Services after modifications signifies your acceptance of the updated
          Terms.
        </p>
        <h4 className={classes["tos__h4"]}>
          3. <strong>Use of Services</strong>
        </h4>
        <ul className={classes["tos__list"]}>
          <li className={classes["tos__list-item"]}>
            You agree to use the Services only for lawful purposes and in
            accordance with these Terms.
          </li>
          <li className={classes["tos__list-item"]}>
            Prohibited activities include, but are not limited to:
            <ul className={classes["tos__list"]}>
              <li className={classes["tos__list-item"]}>
                Engaging in fraudulent, harmful, or malicious activities.
              </li>
              <li>Violating any applicable laws or regulations.</li>
              <li className={classes["tos__list-item"]}>
                Attempting to disrupt or gain unauthorized access to the
                Services.
              </li>
            </ul>
          </li>
        </ul>
        <h4 className={classes["tos__h4"]}>
          4. <strong>Account Responsibilities</strong>
        </h4>
        <ul className={classes["tos__list"]}>
          <li className={classes["tos__list-item"]}>
            You are responsible for maintaining the confidentiality of your
            account and password and for all activities under your account.
          </li>
          <li className={classes["tos__list-item"]}>
            You agree to notify us immediately of any unauthorized access or
            breach of security.
          </li>
        </ul>
        <h4 className={classes["tos__h4"]}>
          5. <strong>Intellectual Property</strong>
        </h4>
        <ul className={classes["tos__list"]}>
          <li className={classes["tos__list-item"]}>
            All content on the Services, including text, graphics, logos, and
            software, is the property of Website or its licensors and is
            protected by intellectual property laws.
          </li>
          <li className={classes["tos__list-item"]}>
            You may not reproduce, distribute, or create derivative works
            without our express written consent.
          </li>
        </ul>
        <h4 className={classes["tos__h4"]}>
          6. <strong>Limitation of Liability</strong>
        </h4>
        <p className={classes["tos__text"]}>
          To the fullest extent permitted by law, Website shall not be liable
          for any direct, indirect, incidental, consequential, or punitive
          damages resulting from your use or inability to use the Services.
        </p>
        <h4 className={classes["tos__h4"]}>
          7. <strong>Termination</strong>
        </h4>
        <p className={classes["tos__text"]}>
          We may suspend or terminate your access to the Services at our sole
          discretion, without notice, for any violation of these Terms or other
          harmful behavior.
        </p>
        <h4 className={classes["tos__h4"]}>
          8. <strong>Governing Law</strong>
        </h4>
        <p className={classes["tos__text"]}>
          These Terms are governed by and construed in accordance with the laws
          of Ukraine. Any disputes arising from these Terms will be subject to
          the exclusive jurisdiction of the courts in Website.
        </p>
      </Card>
    </motion.div>
  );
};

export default ToS;
