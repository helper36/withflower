var CODEFORM = window.CODEFORM || {};

CODEFORM.CUSTOM = {
    init: function () {
        this.header();
        this.gallery();
        this.inquiry();
        this.reveal();
    },

    header: function () {
        var $header = $("#header");
        var update = function () {
            $header.toggleClass("is-scroll", window.scrollY > 10);
        };
        update();
        $(window).on("scroll", update);
    },

    gallery: function () {
        $(".p-gallery__thumbs").on("click", "button", function () {
            var $btn = $(this);
            $btn.addClass("is-active").siblings().removeClass("is-active");
            $(".p-gallery__main img").attr({
                src: $btn.data("src"),
                alt: $btn.find("img").attr("alt"),
            });
        });
    },

    reveal: function () {
        var items = $(".section > .inner > *").addClass("reveal");
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                en.target.classList.add("is-view");
                io.unobserve(en.target);
            });
        }, { rootMargin: "0px 0px -10% 0px" });
        items.each(function () { io.observe(this); });
    },

    inquiry: function () {
        var $modal = $("#inquiryModal");
        if (!$modal.length) return;

        var $form = $modal.find(".sheetForm");
        var $done = $modal.find(".inquiry-done");
        var $submit = $form.find(".form-submit");
        var $error = $form.find(".form-error");
        var sending = false;

        var rules = [
            { name: "name", msg: "이름을 입력해 주세요." },
            {
                name: "phone",
                msg: "연락처를 정확히 입력해 주세요.",
                test: function (v) {
                    return /^01[016789]-\d{3,4}-\d{4}$/.test(v);
                },
            },
            {
                name: "email",
                msg: "이메일을 정확히 입력해 주세요.",
                test: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
                },
            },
            {
                name: "type",
                msg: "문의 유형을 선택해 주세요.",
                test: function () {
                    return $form.find("[name=type]:checked").length > 0;
                },
            },
            { name: "contents", msg: "문의 내용을 입력해 주세요." },
            {
                name: "agree",
                msg: "개인정보 수집 및 이용에 동의해 주세요.",
                test: function () {
                    return $form.find("[name=agree]").prop("checked");
                },
            },
        ];

        var fieldOf = function (name) {
            return $form
                .find("[name=" + name + "]")
                .first()
                .closest(".form-field");
        };
        var setError = function (name, msg) {
            var $field = fieldOf(name);
            $field.addClass("is-error");
            if (msg && !$field.find(".field-msg").length) $field.append('<span class="field-msg">' + msg + "</span>");
        };
        var clearError = function (name) {
            fieldOf(name).removeClass("is-error").find(".field-msg").remove();
            $error.removeClass("is-show").text("");
        };
        var validate = function () {
            var first = null;
            rules.forEach(function (r) {
                clearError(r.name);
                var v = $.trim(
                    $form
                        .find("[name=" + r.name + "]")
                        .first()
                        .val() || "",
                );
                var ok = r.test ? r.test(v) : v.length > 0;
                if (!ok) {
                    setError(r.name, r.msg);
                    if (!first) first = r.name;
                }
            });
            if (first) {
                var $el = $form.find("[name=" + first + "]").first();
                if ($el.is(":visible")) $el.focus();
                else fieldOf(first)[0].scrollIntoView({ block: "center", behavior: "smooth" });
            }
            return !first;
        };

        var open = function () {
            $form.show();
            $done.prop("hidden", true);
            $modal.addClass("is-open").attr("aria-hidden", "false");
            $("body").addClass("hold");
            setTimeout(function () {
                $form.find("[name=name]").focus();
            }, 300);
        };
        var close = function () {
            $modal.removeClass("is-open").attr("aria-hidden", "true");
            $("body").removeClass("hold");
            if (location.hash === "#inquiry") history.replaceState(null, "", location.pathname + location.search);
        };

        $(document).on("click", ".js-inquiry", function (e) {
            e.preventDefault();
            open();
        });
        $modal.on("click", ".modal__dim, .modal__close, .js-inquiry-close", close);
        $(document).on("keydown", function (e) {
            if (e.key === "Escape" && $modal.hasClass("is-open")) close();
        });
        if (location.hash === "#inquiry") open();

        $form.on("input", "[name=phone]", function () {
            var v = this.value.replace(/\D/g, "").slice(0, 11);
            if (v.length > 7) v = v.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
            else if (v.length > 3) v = v.replace(/^(\d{3})(\d+)$/, "$1-$2");
            this.value = v;
        });
        $form.on("input change", "[name]", function () {
            clearError(this.name);
        });

        $form.on("click", ".submit", function () {
            if (sending || !validate()) return;
            if ($form.find("[name=honeypot]").val()) return;
            if ($form.attr("action").indexOf("script.google.com") < 0) {
                $error.text("Apps Script 웹 앱 URL연결이 필요합니다.").addClass("is-show");
                return;
            }
            sending = true;
            $submit.prop("disabled", true).text("전송 중...");
            $form[0].submit();
        });

        $form.find("iframe").on("load", function () {
            if (!sending) return;
            sending = false;
            $form[0].reset();
            $submit.prop("disabled", false).text("문의 보내기");
            $form.hide();
            $done.prop("hidden", false);
        });
    },
};

$(function () {
    CODEFORM.CUSTOM.init();
});
