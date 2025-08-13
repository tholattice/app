import Image from "next/image";
import Link from "next/link";

import SocialMediaLogos from "../../../../components/SocialMediaLogos";

export const ChineseWebsiteCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        5 个快速、美观、移动优先、SEO 优化且符合 ADA 的网站可供选择
      </h3>
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">移动优先</b>:
          通过适合移动设备的网站轻松联系您的客户。我们的网站模板经过精心设计和测试，适合所有现代智能手机并对触摸做出响应。所有小部件（包括我们的预约安排功能）的尺寸也适合移动设备。通过适合移动设备的网站为您的客户提供便捷的体验。
        </li>
        <br />
        <li>
          <b className="font-bold">SEO优化</b>: 让您的网站易于 Google、Bing
          和其他搜索引擎了解您的网站，并将其提供给在当地搜索您的业务的客户。我们网站上的所有页面都会经过检查并不断扫描，以防止众所周知的安全漏洞（例如
          DDOS 攻击、SQL 注入等）。 SSL 证书始终更新，并且使用规范 URL
          来防止搜索引擎混淆多个 URL 中的重复或相似内容。拥有一个经过 SEO
          优化的网站可以让搜索引擎和客户更轻松地找到您的业务。
        </li>
        <br />
        <li>
          <b className="font-bold">快速地</b>:
          良好的搜索引擎优化还包括始终确保我们的网页在客户首次访问时尽可能快地加载，这就是为什么我们的服务器端渲染网站被设计为尽可能快地加载。凭借最新的尖端技术，我们所有的网站都托管在&quot;边缘&quot;，这意味着我们的网站托管在靠近您的客户的地方，并以尽可能最快的方式提供服务。借助
          Tholattice
          的快速网站，您可以放心，客户将留在您的网站上并与其进行更充分的互动。
        </li>
        <br />
        <li>
          <b className="font-bold">美丽的</b>:
          顾客喜欢感觉自己受到巧妙的服务。因此，我们所有的网站模板都经过精心设计，既现代又轻量，在最合适的地方有漂亮的轮播和动画。对于您通过我们的应用程序创建或上传的每个徽标，我们都会仔细平衡所有配色方案，使其最美观、最赏心悦目。
        </li>
        <br />
        <li>
          <b className="font-bold">方便残疾人士使用</b>:
          除了联邦政府的法律规定保证残疾人在公共住宿领域享有平等机会之外，最好让您的网站受到所有客户的欢迎。我们设计网站时遵循{" "}
          <Link href="https://www.w3.org/WAI/WCAG2AA-Conformance">
            WCAG 2.0 AA 指南
          </Link>
          ，因此您可以放心，残障人士在访问您的网站时会感到受到照顾。
        </li>
        {/* <br />
    <li>
      <b className="font-bold">Customizable/Switchable</b>: Update your
      pricing and service offering in real-time through the Tholattice web
      and mobile app. Upload pictures and videos through our app, and have
      them appear in your own gallery carousel.
    </li>{" "}
    <br />
    <li>
      <b className="font-bold">Schedule Appointments</b>: *This should
      probably be in its own section along with the carousel feature. Also
      needs an illustration of the round-robin feature. Could be a blog
      post on its own* Choose from allowing your customers to schedule an
      appointment with the next available masseuse or preferred
      masseuse(s). If scheduling more than one day in advance, remind your
      customers on the day of the appointment via SMS--with their express
      opt-in consent. Can select couples massage and make online payment.
      Ability to cancel/reschedule within 30 minutes to 1 hour of the
      scheduled appointment.
    </li> */}
      </ul>
    </>
  );
};

export const ChineseAppointmentScheduleCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        允许您的客户在您的网站上安排预约
      </h3>
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">实时预约处理</b>: 利用 Tholattice
          移动和网络应用程序的便利性，实时处理来自您的网站和各种社交媒体渠道的传入预约请求。您可以查看已安排预约的完整历史记录，取消、重新安排或将预约委托给您的按摩师。您还可以通过将客户的电话号码和电子邮件地址列入黑名单或影子禁止来阻止客户安排预约。
        </li>
        <br />
        <li>
          <b className="font-bold">循环预约路由</b>: 允许 Tholattice
          根据下一个可用的按摩师或客户选择的首选按摩师列表来路由传入的预约请求。如果顾客选择由下一个可用的按摩师提供服务，管理员可以允许
          Tholattice
          将预约路由到当天顾客数量最少的下一个可用的按摩师，或者不加区别地路由到恰好有空的按摩师
          (贪婪与平等路由分配) 传入的预约也可以通过将 Tholattice
          移动应用程序链接到微信群聊并以这种方式确认预约来处理。一旦确认或拒绝，客户也可以通过短信收到通知。请访问我们的博客文章，了解有关我们专有的预约安排技术的更多详细信息。
        </li>
      </ul>
    </>
  );
};

export const ChineseSMSCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        向您的客户发送短信，提醒他们未来的预约和新优惠或按摩师
      </h3>
      <Image
        className="opacity-90"
        src="/SMS-Text-Phone.png"
        width={750}
        height={750}
        alt="Website Showcase on Desktop and Mobile Devices"
      />
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">预约提醒</b>: 如果您的客户提前 1
          天以上安排预约,
          提醒您的客户并确认他们当天是否会拜访您。此外，允许您的客户通过短信取消或重新安排预约，并重新进入循环队列。这将使您和您的按摩师能够专注于为当前客户提供优质体验，而不是安排预约。
        </li>
        <br />
        <li>
          <b className="font-bold">未接来电短信</b>: 如果您错过客户的电话,
          会自动回复短信。这将使您在繁忙时间不会错过顾客的按摩请求。当您不在时,
          Tholattice
          将处理预约安排。请参阅我们关于未接来电短信的博客文章了解更多详细信息。
        </li>
        <br />
        <li>
          <b className="font-bold">同意和选择加入管理</b>:
          有关短信客户的法律法规非常严格。 Tholattice
          遵守《电话消费者保护法》(TCPA)、联邦通信委员会 (FCC) 以及所有涉及 SMS
          电话营销的加州监管机构颁布的所有法规，包括《加州消费者隐私法》(CCPA)，以确保与您的客户已被安全发送且合法。
        </li>
      </ul>
    </>
  );
};

export const ChineseSocialMediaCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        通过社交媒体扩大和管理您的影响力
      </h3>
      <SocialMediaLogos />
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">提高本地意识</b>:
          利用各种社交媒体算法将您的业务扩展到您所在地区的相关客户。 Tholattice
          允许您使用我们的网络和移动应用程序连接或创建社交媒体资料，从而帮助您做到这一点。无缝上传、生成内容并将其发布到这些社交媒体渠道。
        </li>
        <br />
        <li>
          <b className="font-bold">将管理整合到一个地方</b>:
          避免在多个网站上更新商店营业时间和假期。借助 Tholattice,
          您可以在我们的网络和移动应用程序中完成这一切。 Tholattice
          还将帮助提醒您更新营业时间并更新各种社交媒体渠道上不一致的列表或商店信息。
        </li>
        <br />
        <li>
          <b className="font-bold">对不公平的客户评论提出争议</b>:
          不良的客户评论，尤其是那些指责女按摩师从事非法行为的评论，可能会毁掉一家企业。通过
          Tholattice, 我们会自动通知您任何差评,
          并允许您用您的母语对评论提出异议。我们有以英语为母语的人,
          他们将审核您的申请, 以确保获得最佳批准机会,
          并将其转发到您的社交媒体渠道。
        </li>
        <br />
        <li>
          <b className="font-bold">本地目录更新 (外部 SEO)</b>: 尽管 Tholattice
          始终致力于改进站内 SEO,
          但我们也致力于通过站外方法提高网站可见度。这包括确保您的所有业务信息都是最新的,
          并在所有知名本地目录中列出, 包括 GMB、Bing、Apple 地图和 50
          多个其他目录。当您的公司出现在这些目录中时,
          搜索引擎会对您的网站进行更有利的排名,
          并且更有可能向更多在当地搜索按摩的人展示您的网站。
        </li>
        <br />
        <li>
          <b className="font-bold">专业目录 (按摩师/客厅匹配)</b>:
          有一些由各个社区创建的小型私人目录和论坛,
          用于评论按摩院和独立按摩师。立即获悉所有这些目录的新更新,
          并在客户提到为您的企业工作的特定按摩师时收到通知。 Tholattice
          将尽力将按摩师的姓名与您的位置相匹配, 并立即通知您。
        </li>
      </ul>
    </>
  );
};
