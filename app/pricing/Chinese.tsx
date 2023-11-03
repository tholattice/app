import Image from "next/image";

import { PLANS } from "@/lib/stripe/utils";

import { SimpleTooltipContent } from "@/app/components/Tooltip";
import { IPricingItems } from "@/lib/types/pricing";

export const ChinesePricingHeadline = () => {
  return (
    <div className="mx-auto mb-10 sm:max-w-lg">
      <h1 className="font-display font-normal text-4xl text-black sm:text-6xl">
        清晰且
        <span className="lifeGradientText">高质量</span>
        <br />
        的定价
      </h1>
      <p className="mt-5 text-gray-600 text-lg sm:text-xl">
        无隐藏费用。至少 3 个月的承诺后可
        <br />
        随时免费取消
      </p>
    </div>
  );
};

export const PricingItemsChinese: Array<IPricingItems> = [
  {
    plan: "必需品",
    tagline: "对于需要强大数字化影响力的小型商店",
    activeMasseuses: 5,
    features: [
      {
        text: "漂亮、适合移动设备的网站 (5 个以上模板)",
        subText: [
          {
            subContent: "实时客户预约安排小部件",
            subFootnote: (
              <SimpleTooltipContent
                title="客户只能在 必需品 上选择下一个可用的按摩师，但在 专业的+ 计划上可以选择基于偏好的循环路由。"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "女按摩师旋转木马画廊",
            subFootnote: (
              <SimpleTooltipContent
                // title="Display Active Masseuses in Real-Time on Your Website using AI-Generated Imagery ($50 One-Time Fee Add-On for Essentials Plan, Included in Professional+ Plans."
                title="使用人工智能生成的图像在您的网站上实时显示活跃的按摩师。包括 5 个头像配置文件。每个额外的头像价格为 25 美元。"
                cta="了解更多。"
                href="/blog/masseuse-carousel"
              />
            ),
            // subNeutral: true,
          },
          {
            subContent: "聊天机器人对话人工智能——预约安排/常见问题处理",
            // subNegative: true,
          },
          {
            subContent: "客户自动发送短信预约提醒",
            subFootnote: (
              <SimpleTooltipContent
                title="对于提前一天以上安排的预约"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
            subNegative: true,
          },
          {
            subContent: "客户可以在线支付预约费用",
            subNegative: true,
          },
          {
            subContent: "增强的网站分析",
            subFootnote: (
              <SimpleTooltipContent
                title="查看您的客户最常参与哪些内容"
                cta="了解更多。"
                href="/blog/enhanced-web-analytics"
              />
            ),
            subNegative: true,
          },
          {
            subContent: "每周 5 篇以上本地撰写的高质量博客文章 (图片、视频)",
            subFootnote: (
              <SimpleTooltipContent
                title="还发布在与您的订阅计划相关的所有社交媒体渠道上"
                cta="了解更多。"
                href="/blog/blog-posts"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "网络和移动按摩治疗管理应用程序",
        subText: [
          {
            subContent: "实时处理传入的预约请求",
            subFootnote: (
              <SimpleTooltipContent
                title="通过应用程序和微信群聊通知所有按摩师收到的请求"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "为按摩师生成人工智能头像图片",
            subFootnote: (
              <SimpleTooltipContent
                title="基于按摩师上传或随机生成。自动上传到网站和按摩师轮播。 Essentials 中包含 5 个按摩师头像。专业版包含 10 个，高级版包含 20 个。"
                cta="了解更多。"
                href="/blog/ai-generated-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "未接来电短信和对话式人工智能——解答客户常见问题",
            subFootnote: (
              <SimpleTooltipContent
                title="接收包含您企业本地区号的 10 位虚拟电话号码。"
                cta="了解更多。"
                href="/blog/virtual-phone-numbers"
              />
            ),
            subNegative: true,
          },
          {
            subContent: "从私人社区和利基论坛获取客户评论通知",
            subFootnote: (
              <SimpleTooltipContent
                title="顾客喜欢在他们喜欢光顾的按摩院周围形成社区。查看有关 Tholattice 如何让您了解您在这些社区中的声誉的更多信息"
                cta="了解更多。"
                href="/blog/private-communities-reputation"
              />
            ),
            subNegative: true,
          },
          {
            subContent: "在中国社交媒体 (微信和微博) 上分享您的企业创建的内容",
            subNegative: true,
          },
          {
            subContent: "为您的企业创建自定义徽标 (AI 生成)",
            subFootnote: (
              <SimpleTooltipContent
                title="通过微信/电子邮件接收 Adobe Photoshop 和 Illustrator 的数字副本。适用于传单/标牌/名片。"
                cta="了解更多。"
                href="/blog/custom-logo-creation"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "向客户发送自定义电子邮件活动，以通知新的特价商品或按摩师",
            subFootnote: (
              <SimpleTooltipContent
                title="还包括作为人工智能聊天机器人提供的后续电子邮件序列，以协助预约安排和常见问题解答处理"
                cta="了解更多。"
                href="/blog/email-campaigns"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "社交媒体声誉管理",
        subText: [
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Google My Business, Yelp</p>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/GMB-Logo.png"
                    width={25}
                    height={25}
                    alt="Google My Business Logo"
                  />
                </div>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/Yelp-Logo.png"
                    width={25}
                    height={25}
                    alt="Yelp Logo"
                  />
                </div>
              </div>
            ),
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Facebook</p>
                <div>
                  <Image
                    src="/Facebook-Logo.svg"
                    width={25}
                    height={25}
                    alt="Facebook Logo"
                  />
                </div>
              </div>
            ),
            subNegative: true,
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Instagram</p>
                <div>
                  <Image
                    src="/Instagram-Logo.svg"
                    width={25}
                    height={25}
                    alt="Instagram Logo"
                  />
                </div>
              </div>
            ),
            subNegative: true,
          },
          {
            subContent: "在网络/移动应用程序中接收和处理所有传入的预约请求",
          },
          {
            subContent: "用普通话对不公平或不准确的顾客评论提出争议",
            subFootnote: (
              <SimpleTooltipContent
                title="专业+计划中的网络/移动应用程序提供人工智能生成的自动建议。所有客户评论均由高级计划中的 Tholattice 客户支持的英语母语人士手动审核。"
                cta="了解更多。"
                href="/blog/dispute-customer-reviews"
              />
            ),
          },
          {
            subContent: "上传/生成位置 (外部/内部) 和按摩师的照片并安排帖子",
            subFootnote: (
              <SimpleTooltipContent
                title="能够将位置的所有图像和手动上传的照片上传到应用程序。发布和安排所有生成的图像仅适用于 Professional+ 计划"
                cta="了解更多。"
                href="/blog/social-media-content"
              />
            ),
            subNeutral: true,
          },
          {
            subContent: "由英语母语人士审核并代表您回复的客户评论",
            subNegative: true,
          },
        ],
        footnote: (
          <SimpleTooltipContent
            title="Tholattice 代表您定期向这些社交媒体渠道发布内容。可通过网络/移动应用程序访问。"
            cta="了解更多。"
            href="/blog/social-media-content"
          />
        ),
      },
      {
        text: "更新、维护 50 多个在线目录中一致的业务信息",
        footnote: (
          <SimpleTooltipContent
            title="功能立即提高您网站的 SEO 知名度。 Essentials 会员一次性附加费为 100 美元，专业会员附加费为 50 美元，高级会员免费"
            cta="了解更多。"
            href="/blog/online-directories-seo"
          />
        ),
        neutral: true,
      },
    ],
    cta: "开始使用",
  },
  {
    plan: "专业的",
    tagline: "对于大多数需要全面解决方案的商店",
    activeMasseuses: PLANS.find((p) => p.slug === "professional")!
      .activeMasseuses,
    features: [
      {
        text: "漂亮、适合移动设备的网站 (5 个以上模板)",
        subText: [
          {
            subContent: "实时客户预约安排小部件",
            subFootnote: (
              <SimpleTooltipContent
                title="客户只能在 必需品 上选择下一个可用的按摩师，但在 专业的+ 计划上可以选择基于偏好的循环路由。"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "女按摩师旋转木马画廊",
            subFootnote: (
              <SimpleTooltipContent
                title="使用人工智能生成的图像在您的网站上实时显示活跃的按摩师。包括 5 个头像配置文件。每个额外的头像价格为 25 美元。"
                cta="了解更多。"
                href="/blog/masseuse-carousel"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "聊天机器人对话人工智能——预约安排/常见问题处理",
            subNegative: false,
          },
          {
            subContent: "客户自动发送短信预约提醒",
            subFootnote: (
              <SimpleTooltipContent
                title="对于提前一天以上安排的预约"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "客户可以在线支付预约费用",
            subNegative: true,
          },
          {
            subContent: "增强的网站分析",
            subFootnote: (
              <SimpleTooltipContent
                title="查看您的客户最常参与哪些内容"
                cta="了解更多。"
                href="/blog/enhanced-web-analytics"
              />
            ),
            subNegative: true,
          },
          {
            subContent: "每周 5 篇以上本地撰写的高质量博客文章 (图片、视频)",
            subFootnote: (
              <SimpleTooltipContent
                title="还发布在与您的订阅计划相关的所有社交媒体渠道上"
                cta="了解更多。"
                href="/blog/blog-posts"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "网络和移动按摩治疗管理应用程序",
        subText: [
          {
            subContent: "实时处理传入的预约请求",
            subFootnote: (
              <SimpleTooltipContent
                title="通过应用程序和微信群聊通知所有按摩师收到的请求"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "为按摩师生成人工智能头像图片",
            subFootnote: (
              <SimpleTooltipContent
                title="基于按摩师上传或随机生成。自动上传到网站和按摩师轮播。 Essentials 中包含 5 个按摩师头像。专业版包含 10 个，高级版包含 20 个。"
                cta="了解更多。"
                href="/blog/ai-generated-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "未接来电短信和对话式人工智能——解答客户常见问题",
            subFootnote: (
              <SimpleTooltipContent
                title="接收包含您企业本地区号的 10 位虚拟电话号码。"
                cta="了解更多。"
                href="/blog/virtual-phone-numbers"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "从私人社区和利基论坛获取客户评论通知",
            subFootnote: (
              <SimpleTooltipContent
                title="顾客喜欢在他们喜欢光顾的按摩院周围形成社区。查看有关 Tholattice 如何让您了解您在这些社区中的声誉的更多信息"
                cta="了解更多。"
                href="/blog/private-communities-reputation"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "在中国社交媒体 (微信和微博) 上分享您的企业创建的内容",
            subNegative: true,
          },
          {
            subContent: "为您的企业创建自定义徽标 (AI 生成)",
            subFootnote: (
              <SimpleTooltipContent
                title="通过微信/电子邮件接收 Adobe Photoshop 和 Illustrator 的数字副本。适用于传单/标牌/名片。"
                cta="了解更多。"
                href="/blog/custom-logo-creation"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "向客户发送自定义电子邮件活动，以通知新的特价商品或按摩师",
            subFootnote: (
              <SimpleTooltipContent
                title="还包括作为人工智能聊天机器人提供的后续电子邮件序列，以协助预约安排和常见问题解答处理"
                cta="了解更多。"
                href="/blog/email-campaigns"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "社交媒体声誉管理",
        subText: [
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Google My Business, Yelp</p>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/GMB-Logo.png"
                    width={25}
                    height={25}
                    alt="Google My Business Logo"
                  />
                </div>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/Yelp-Logo.png"
                    width={25}
                    height={25}
                    alt="Yelp Logo"
                  />
                </div>
              </div>
            ),
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Facebook</p>
                <div>
                  <Image
                    src="/Facebook-Logo.svg"
                    width={25}
                    height={25}
                    alt="Facebook Logo"
                  />
                </div>
              </div>
            ),
            subNegative: false,
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Instagram</p>
                <div>
                  <Image
                    src="/Instagram-Logo.svg"
                    width={25}
                    height={25}
                    alt="Instagram Logo"
                  />
                </div>
              </div>
            ),
            subNegative: true,
          },
          {
            subContent: "在网络/移动应用程序中接收和处理所有传入的预约请求",
          },
          {
            subContent: "用普通话对不公平或不准确的顾客评论提出争议",
            subFootnote: (
              <SimpleTooltipContent
                title="专业+计划中的网络/移动应用程序提供人工智能生成的自动建议。所有客户评论均由高级计划中的 Tholattice 客户支持的英语母语人士手动审核。"
                cta="了解更多。"
                href="/blog/dispute-customer-reviews"
              />
            ),
          },
          {
            subContent: "上传/生成位置 (外部/内部) 和按摩师的照片并安排帖子",
            subFootnote: (
              <SimpleTooltipContent
                title="为社交媒体内容生成图像的能力仅适用于 Professional+ 计划"
                cta="了解更多。"
                href="/blog/social-media-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "由英语母语人士审核并代表您回复的客户评论",
            subNegative: true,
          },
        ],
        footnote: (
          <SimpleTooltipContent
            title="Tholattice 代表您定期向这些社交媒体渠道发布内容。可通过网络/移动应用程序访问。"
            cta="了解更多。"
            href="/blog/social-media-content"
          />
        ),
      },
      {
        text: "更新、维护 50 多个在线目录中一致的业务信息",
        footnote: (
          <SimpleTooltipContent
            title="功能立即提高您网站的 SEO 知名度。 Essentials 会员一次性附加费为 100 美元，专业会员附加费为 50 美元，高级会员免费"
            cta="了解更多。"
            href="/blog/online-directories-seo"
          />
        ),
        neutral: true,
      },
    ],
    cta: "开始使用",
  },
  {
    plan: "优质的",
    tagline: "对于需要高级功能的具有良好品牌的大型商店",
    activeMasseuses: PLANS.find((p) => p.slug === "premium")!.activeMasseuses,
    features: [
      {
        text: "漂亮、适合移动设备的网站 (5 个以上模板)",
        subText: [
          {
            subContent: "实时客户预约安排小部件",
            subFootnote: (
              <SimpleTooltipContent
                title="客户只能在 必需品 上选择下一个可用的按摩师，但在 专业的+ 计划上可以选择基于偏好的循环路由。"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "女按摩师旋转木马画廊",
            subFootnote: (
              <SimpleTooltipContent
                title="使用人工智能生成的图像在您的网站上实时显示活跃的按摩师。包括 5 个头像配置文件。每个额外的头像价格为 25 美元。"
                cta="了解更多。"
                href="/blog/masseuse-carousel"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "聊天机器人对话人工智能——预约安排/常见问题处理",
            subNegative: false,
          },
          {
            subContent: "客户自动发送短信预约提醒",
            subFootnote: (
              <SimpleTooltipContent
                title="对于提前一天以上安排的预约"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "客户可以在线支付预约费用",
            subNegative: false,
          },
          {
            subContent: "增强的网站分析",
            subFootnote: (
              <SimpleTooltipContent
                title="查看您的客户最常参与哪些内容"
                cta="了解更多。"
                href="/blog/enhanced-web-analytics"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "每周 5 篇以上本地撰写的高质量博客文章 (图片、视频)",
            subFootnote: (
              <SimpleTooltipContent
                title="还发布在与您的订阅计划相关的所有社交媒体渠道上"
                cta="了解更多。"
                href="/blog/blog-posts"
              />
            ),
            subNegative: false,
          },
        ],
      },
      {
        text: "网络和移动按摩治疗管理应用程序",
        subText: [
          {
            subContent: "实时处理传入的预约请求",
            subFootnote: (
              <SimpleTooltipContent
                title="通过应用程序和微信群聊通知所有按摩师收到的请求"
                cta="了解更多。"
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "为按摩师生成人工智能头像图片",
            subFootnote: (
              <SimpleTooltipContent
                title="基于按摩师上传或随机生成。自动上传到网站和按摩师轮播。 Essentials 中包含 5 个按摩师头像。专业版包含 10 个，高级版包含 20 个。"
                cta="了解更多。"
                href="/blog/ai-generated-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "未接来电短信和对话式人工智能——解答客户常见问题",
            subFootnote: (
              <SimpleTooltipContent
                title="接收包含您企业本地区号的 10 位虚拟电话号码。"
                cta="了解更多。"
                href="/blog/virtual-phone-numbers"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "从私人社区和利基论坛获取客户评论通知",
            subFootnote: (
              <SimpleTooltipContent
                title="顾客喜欢在他们喜欢光顾的按摩院周围形成社区。查看有关 Tholattice 如何让您了解您在这些社区中的声誉的更多信息"
                cta="了解更多。"
                href="/blog/private-communities-reputation"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "在中国社交媒体 (微信和微博) 上分享您的企业创建的内容",
            subNegative: false,
          },
          {
            subContent: "为您的企业创建自定义徽标 (AI 生成)",
            subFootnote: (
              <SimpleTooltipContent
                title="通过微信/电子邮件接收 Adobe Photoshop 和 Illustrator 的数字副本。适用于传单/标牌/名片。"
                cta="了解更多。"
                href="/blog/custom-logo-creation"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "向客户发送自定义电子邮件活动，以通知新的特价商品或按摩师",
            subFootnote: (
              <SimpleTooltipContent
                title="还包括作为人工智能聊天机器人提供的后续电子邮件序列，以协助预约安排和常见问题解答处理"
                cta="了解更多。"
                href="/blog/email-campaigns"
              />
            ),
            subNegative: false,
          },
        ],
      },
      {
        text: "社交媒体声誉管理",
        subText: [
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Google My Business, Yelp</p>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/GMB-Logo.png"
                    width={25}
                    height={25}
                    alt="Google My Business Logo"
                  />
                </div>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/Yelp-Logo.png"
                    width={25}
                    height={25}
                    alt="Yelp Logo"
                  />
                </div>
              </div>
            ),
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Facebook</p>
                <div>
                  <Image
                    src="/Facebook-Logo.svg"
                    width={25}
                    height={25}
                    alt="Facebook Logo"
                  />
                </div>
              </div>
            ),
            subNegative: false,
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Instagram</p>
                <div>
                  <Image
                    src="/Instagram-Logo.svg"
                    width={25}
                    height={25}
                    alt="Instagram Logo"
                  />
                </div>
              </div>
            ),
            subNegative: false,
          },
          {
            subContent: "在网络/移动应用程序中接收和处理所有传入的预约请求",
          },
          {
            subContent: "用普通话对不公平或不准确的顾客评论提出争议",
            subFootnote: (
              <SimpleTooltipContent
                title="专业+计划中的网络/移动应用程序提供人工智能生成的自动建议。所有客户评论均由高级计划中的 Tholattice 客户支持的英语母语人士手动审核。"
                cta="了解更多。"
                href="/blog/dispute-customer-reviews"
              />
            ),
          },
          {
            subContent: "上传/生成位置 (外部/内部) 和按摩师的照片并安排帖子",
            subFootnote: (
              <SimpleTooltipContent
                title="为社交媒体内容生成图像的能力仅适用于 Professional+ 计划"
                cta="了解更多。"
                href="/blog/social-media-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent: "由英语母语人士审核并代表您回复的客户评论",
            subNegative: false,
          },
        ],
        footnote: (
          <SimpleTooltipContent
            title="Tholattice 代表您定期向这些社交媒体渠道发布内容。可通过网络/移动应用程序访问。"
            cta="了解更多。"
            href="/blog/social-media-content"
          />
        ),
      },
      {
        text: "更新、维护 50 多个在线目录中一致的业务信息",
        footnote: (
          <SimpleTooltipContent
            title="功能立即提高您网站的 SEO 知名度。 Essentials 会员一次性附加费为 100 美元，专业会员附加费为 50 美元，高级会员免费"
            cta="了解更多。"
            href="/blog/online-directories-seo"
          />
        ),
        neutral: false,
      },
    ],
    cta: "开始使用",
  },
];
