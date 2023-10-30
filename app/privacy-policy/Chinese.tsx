import Link from "next/link";

export const ChineseIntrouction = () => {
  return (
    <p>
      欢迎来到 Tholattice 数字营销！本隐私政策概述了 Tholattice Digital
      Marketing LLC (位于 1637 Burning Tree Dr., Hundred Oaks, CA 91362, United
      States) (&quot;Tholattice Digital Marketing,
      &quot;我们&quot;、&quot;我们的&quot;或&quot;我们的&quot;)如何收集、使用、当您访问我们的网站{" "}
      <Link href="/">https://www.tholattice.com</Link> (“网站”)
      并使用我们的网络和移动应用程序 (统称为服务) 时，保护个人信息。
    </p>
  );
};

export const ChineseInformationCollected = () => {
  return (
    <>
      <p>我们可能会收集以下类型的个人信息:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>
          <b>个人标识符</b>:
          例如您的名字和姓氏、电子邮件地址、电话号码以及从以下网站检索到的社交媒体信息
          微信、谷歌和脸书。
        </li>
        <br />
        <li>
          <b>使用数据</b>: I与您如何与网站和我们的服务互动相关的信息, 包括 IP
          地址、设备信息和浏览行为。
        </li>
      </ul>
    </>
  );
};

export const ChineseDataRetention = () => {
  return (
    <p>
      Tholattice Digital Marketing LLC 将在取消后保留用户输入的所有数据 30
      天内。这些数据存储在我们的第三方云数据库提供商{" "}
      <Link href="https://supabase.com/">Supabase Inc.</Link>
      中，以便为非活跃用户提供重新订阅我们的服务的选项，而不会影响用户体验。非活跃用户也可以充分使用我们的网络和移动应用程序的免费版本。非活动用户可以通过登录永久删除与其关联的所有数据{" "}
      <Link href="https://app.tholattice.com/settings/purge">
        https://app.tholattice.com/settings/purge
      </Link>{" "}
      并单击以清除所有数据。
    </p>
  );
};

export const ChineseHowWeUse = () => {
  return (
    <>
      <p>我们将收集的信息用于以下目的:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>提供和改进我们的服务.</li>
        <br />
        <li>与您沟通、回复询问并提供客户支持.</li>
        <br />
        <li>遵守法律和监管要求.</li>
      </ul>
    </>
  );
};

export const ChineseSharingInformation = () => {
  return (
    <>
      <p>我们可能会与以下人员分享您的信息:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>
          <b>服务供应商</b>:
          我们可能会与第三方服务提供商共享数据，以协助我们提供服务。这些提供商受合同约束以保护您的数据
        </li>
        <br />
        <li>
          <b>法律当局</b>:
          如果法律、法规要求或响应传票或法院命令，我们可能会披露信息。
        </li>
        <br />
        <li>
          <b>第三方</b>:
          经您同意，我们可能会出于营销和广告目的与第三方共享您的数据。
        </li>
      </ul>
    </>
  );
};

export const ChineseCookies = () => {
  return (
    <p>
      我们可能会在网站和我们的服务中使用 cookie
      和类似技术。您可以通过调整浏览器设置来管理您的 cookie 首选项。
    </p>
  );
};

export const Chinese3rdParty = () => {
  return (
    <>
      <p>我们使用以下第三方服务，每个服务都有自己的隐私政策:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>
          <b>谷歌分析</b>: 我们使用 Google Analytics
          来分析我们网站上的用户行为。欲了解更多信息，请查看{" "}
          <Link href="https://policies.google.com/privacy">
            Google&apos;s 隐私政策.
          </Link>
        </li>
        <br />
        <li>
          <b>脸书像素</b>: 我们使用 Facebook Pixels 进行跟踪和定向广告。请查阅{" "}
          <Link href="https://www.facebook.com/policy.php">
            Facebook&apos;s 数据政策
          </Link>{" "}
          更多细节。
        </li>
        <br />
        <li>
          <b>短信营销 (Twilio, Inc.)</b>: 我们使用 Twilio, Inc.
          进行短信营销。请查阅{" "}
          <Link href="https://www.twilio.com/legal/privacy">
            Twilio&apos;s 隐私政策
          </Link>{" "}
          了解更多信息。
        </li>
        <br />
        <li>
          <b>电子邮件营销 (SendGrid, Inc.)</b>: 我们使用 SendGrid, Inc.
          进行电子邮件营销。审查{" "}
          <Link href="https://sendgrid.com/policies/privacy/services-privacy-policy/">
            SendGrid&apos;s 隐私政策
          </Link>
          了解更多信息。
        </li>
      </ul>
    </>
  );
};

export const ChineseDataBreach = () => {
  return (
    <p>
      如果发生数据泄露，我们将立即在 24
      小时内发送电子邮件，让您了解此类泄露的程度、泄露的信息（如果有）以及我们解决问题的进展情况。
    </p>
  );
};

export const ChineseStripe = () => {
  return (
    <p>
      我们使用 Stripe, Inc. 进行付款处理。您的支付卡详细信息由 Stripe
      加密和处理。 Tholattice Digital Marketing
      不会存储或访问您的支付卡信息。请查阅{" "}
      <Link href="https://stripe.com/privacy">Stripe&apos;s 隐私政策</Link>{" "}
      了解更多信息。
    </p>
  );
};

export const ChineseRemarketing = () => {
  return (
    <p>
      我们将再营销服务用于营销和广告目的。这些服务可能会在其他网站上展示我们的广告。您可以通过在网络或移动应用程序上调整您的偏好来选择退出这些服务。
    </p>
  );
};

export const ChineseAgeVerification = () => {
  return (
    <p>
      Tholattice Digital Marketing LLC 不会收集 13
      岁以下儿童的数据。我们实施年龄验证检查，以确保不收集未成年儿童的数据。
    </p>
  );
};

export const ChineseUpdatesToPP = () => {
  return (
    <p>
      Tholattice Digital Marketing LLC
      保留随时更改本隐私政策的权利。本隐私政策的更新将通过电子邮件发送。
    </p>
  );
};

export const ChineseRightsAndChoices = () => {
  return (
    <ul className="list-disc pl-8">
      <li>
        <b>访问和删除</b>: 您可以请求访问和删除您的个人信息。
      </li>
      <br />
      <li>
        <b>选择退出</b>: 您可以按照通信中提供的说明随时选择退出营销通信。
      </li>
    </ul>
  );
};

export const ChineseContact = () => {
  return (
    <p>
      如果您对我们的隐私惯例有任何疑问或疑虑，请通过 alex@tholattice.com
      联系我们或访问我们的联系页面:{" "}
      <Link href="/contact">https://www.tholattice.com/contact</Link>.
    </p>
  );
};
